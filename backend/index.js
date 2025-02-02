import express from "express";
import cors from "cors";
import os from "os";
import osu from "node-os-utils";
import psList from "ps-list";
import metricsDb from "./db/metricsDB.js";
import alertsDb from "./db/alertDB.js";
import alertSchema from "./schema.js";
import cookieParser from "cookie-parser";

import nodeDiskInfo from "node-disk-info";

import fs from "fs";
import crypto from "crypto";

const cpu = osu.cpu;
const netstat = osu.netstat;

const app = express();
const port = 6969;

const passwordFilePath = "./password.txt";
const algorithm = "aes-256-ctr";
const keyFilePath = "./key.json";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const processMetricFetcher = async (pid) => {
  const processes = await psList();
  return processes.find((proc) => proc.pid === pid);
};

const systemDiskUsageFetcher = async () => {
  const disks = await nodeDiskInfo.getDiskInfo();

  const totalAllDisks = disks.reduce(
    (acc, disk) => {
      acc.blocks += disk.blocks;
      acc.used += disk.used;
      acc.available += disk.available;
      return acc;
    },
    { blocks: 0, used: 0, available: 0 }
  );

  const diskArray = disks
    .sort((a, b) => b.used - a.used)
    .slice(0, 5)
    .map((disk) => ({
      filesystem: disk.filesystem,
      blocks: disk.blocks,
      used: disk.used,
      available: disk.available,
      capacity: disk.capacity,
      mounted: disk.mounted,
    }));

  diskArray.push({ totalAllDisks });

  return diskArray;
};

const systemMetricsFetcher = async () => {
  const cpuUsage = await cpu.usage();
  const ramTotal = os.totalmem() / 1024 / 1024;
  const ramUsed = (os.totalmem() - os.freemem()) / 1024 / 1024;

  const netStats = await netstat.inOut();

  const bandwidthDownKb = netStats.total.inputMb * 1024;
  const bandwidthUpKb = netStats.total.outputMb * 1024;

  return {
    cpuUsage: cpuUsage.toFixed(2),
    ramTotal: ramTotal.toFixed(2),
    ramUsed: ramUsed.toFixed(2),
    bandwidthDownKb: bandwidthDownKb.toFixed(2),
    bandwidthUpKb: bandwidthUpKb.toFixed(2),
  };
};

const systemMetricsStore = async () => {
  const metrics = await systemMetricsFetcher();
  const stmt = metricsDb.prepare(`
    INSERT INTO systemMetrics (cpuUsage, ramTotal, ramUsed, bandwidthDownKb, bandwidthUpKb)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    metrics.cpuUsage,
    metrics.ramTotal,
    metrics.ramUsed,
    metrics.bandwidthDownKb,
    metrics.bandwidthUpKb
  );
};

setInterval(systemMetricsStore, 2000);

app.get("/metrics/system", async (req, res) => {
  res.json(await systemMetricsFetcher());
});

app.get("/metrics/systemDisk", async (req, res) => {
  res.json(await systemDiskUsageFetcher());
});

app.get("/metrics/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  try {
    const processInfo = await processMetricFetcher(pid);
    if (processInfo) {
      res.json(processInfo);
    } else {
      res.status(404).json({ error: "Process not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch process metrics" });
  }
});

app.get("/ps", async (req, res) => {
  try {
    const processes = await psList();
    res.json(processes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch process metrics" });
  }
});

const storeAlert = async (alert) => {
  const effectedProcesses = await Promise.all(
    alert.effected_pids.map(async (pid) => {
      const processInfo = await processMetricFetcher(pid);
      return processInfo || { pid, error: "Process not found" };
    })
  );

  const systemMetrics = await systemMetricsFetcher();

  const stmt = alertsDb.prepare(`
    INSERT INTO alerts (severity_level, message, effected_pids, system_metrics)
    VALUES (?, ?, ?,?)
  `);

  stmt.run(
    alert.severity_level,
    alert.message,
    JSON.stringify(effectedProcesses),
    JSON.stringify(systemMetrics)
  );
};

app.post("/alerts", (req, res) => {
  try {
    const alert = alertSchema.parse(req.body);

    storeAlert(alert);

    res.status(201).json({ message: "Alert received and stored successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Invalid alert data", msg: error.issues[0].message });
  }
});

app.get("/alerts", (req, res) => {
  try {
    const alerts = alertsDb.prepare("SELECT * FROM alerts").all();
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

app.get("/alerts/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const alert = alertsDb.prepare("SELECT * FROM alerts WHERE id = ?").get(id);
    if (alert) {
      res.json(alert);
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch alert" });
  }
});

app.post("/alerts/:id/acknowledge", (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    alertsDb
      .prepare(
        "UPDATE alerts SET acknowledged = CASE WHEN acknowledged = 0 THEN 1 ELSE 0 END WHERE id = ?"
      )
      .run(id);

    const updatedAlert = alertsDb
      .prepare("SELECT * FROM alerts WHERE id = ?")
      .get(id);

    if (updatedAlert) {
      res.json(updatedAlert);
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

app.post("/alerts/:id/remove", (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const stmt = alertsDb.prepare("DELETE FROM alerts WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes > 0) {
      res.json({ message: "Alert removed successfully" });
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove alert" });
  }
});

let secretKey;
let iv;

const loadOrGenerateKey = () => {
  if (fs.existsSync(keyFilePath)) {
    const keyData = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
    secretKey = Buffer.from(keyData.secretKey, "hex");
    iv = Buffer.from(keyData.iv, "hex");
  } else {
    secretKey = crypto.randomBytes(32);
    iv = crypto.randomBytes(16);
    const keyData = {
      secretKey: secretKey.toString("hex"),
      iv: iv.toString("hex"),
    };
    fs.writeFileSync(keyFilePath, JSON.stringify(keyData));
  }
};

loadOrGenerateKey();

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decrypt = (hash) => {
  const [iv, encrypted] = hash.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    secretKey,
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

app.post("/set-password", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).send("Password is required");
  }

  if (fs.existsSync(passwordFilePath)) {
    return res.status(400).send("Password is already set");
  }

  const encryptedPassword = encrypt(password);
  fs.writeFileSync(passwordFilePath, encryptedPassword);
  res.status(200).send("Password set successfully");
});

app.post("/verify-password", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).send("Password is required");
  }

  if (!fs.existsSync(passwordFilePath)) {
    return res.status(400).send("No password set");
  }

  const storedPassword = fs.readFileSync(passwordFilePath, "utf8");
  const decryptedPassword = decrypt(storedPassword);

  if (password === decryptedPassword) {
    res.cookie("session", "authenticated", { httpOnly: true, secure: true });
    res.status(200).send("Password verified successfully");
  } else {
    res.status(400).send("Incorrect password");
  }
});

app.get("/password-status", (req, res) => {
  if (fs.existsSync(passwordFilePath)) {
    res.status(200).send("Password is set");
  } else {
    res.status(200).send("No password set");
  }
});

app.get("/verify-session", (req, res) => {
  const sessionCookie = req.cookies.session;
  if (sessionCookie === "authenticated") {
    res.status(200).send("Session is valid");
  } else {
    res.status(401).send("Session is invalid");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("session", { httpOnly: true, secure: true });
  res.status(200).send("Logged out successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
