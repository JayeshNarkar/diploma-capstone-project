const express = require("express");
const os = require("os");
const cors = require("cors");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const netstat = osu.netstat;

const app = express();
const port = 6969;

app.use(cors());

app.get("/metrics", async (req, res) => {
  const cpuUsage = await cpu.usage();
  const ramTotal = os.totalmem() / 1024 / 1024;
  const ramUsed = (os.totalmem() - os.freemem()) / 1024 / 1024;

  const netStats = await netstat.inOut();

  const bandwidthDownKb = netStats.total.inputMb * 1024;
  const bandwidthUpKb = netStats.total.outputMb * 1024;

  res.json({
    cpuUsage: cpuUsage.toFixed(2),
    ramTotal: ramTotal.toFixed(2),
    ramUsed: ramUsed.toFixed(2),
    bandwidthDownKb: bandwidthDownKb.toFixed(2),
    bandwidthUpKb: bandwidthUpKb.toFixed(2),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
