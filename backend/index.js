import express from "express";
import cors from "cors";
import os from "os";
import osu from "node-os-utils";
import psList from "ps-list";
import db from "./db.js";
import alertsDb from "./alertDB.js";
import alertSchema from "./schema.js";

import nodeDiskInfo from "node-disk-info";

const cpu = osu.cpu;
const netstat = osu.netstat;

const app = express();
const port = 6969;

app.use(cors());
app.use(express.json());

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
  const stmt = db.prepare(`
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

const processes = await psList();

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

const storeAlert = (alert) => {
  const stmt = alertsDb.prepare(`
    INSERT INTO alerts (timestamp, severity_level, message, effected_pids)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(
    alert.timestamp,
    alert.severity_level,
    alert.message,
    JSON.stringify(alert.effected_pids)
  );
};

app.post("/alerts", (req, res) => {
  try {
    const alert = alertSchema.parse(req.body);

    storeAlert(alert);

    res.status(201).json({ message: "Alert received and stored successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid alert data" });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
