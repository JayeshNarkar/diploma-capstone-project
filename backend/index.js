import express from "express";
import cors from "cors";
import os from "os";
import osu from "node-os-utils";
import psList from "ps-list";
import db from "./db.js";

const cpu = osu.cpu;
const netstat = osu.netstat;

const app = express();
const port = 6969;

app.use(cors());

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

const processes = await psList();

app.get("/metrics/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  try {
    const processInfo = processes.find((proc) => proc.pid === pid);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
