import Database from "better-sqlite3";
const metricsDB = new Database("metrics.db", { verbose: console.log });

metricsDB.exec(`
  CREATE TABLE IF NOT EXISTS systemMetrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpuUsage REAL,
    ramTotal REAL,
    ramUsed REAL,
    bandwidthDownKb REAL,
    bandwidthUpKb REAL
  )
`);

export default metricsDB;
