const Database = require("better-sqlite3");
const db = new Database("metrics.db", { verbose: console.log });

db.exec(`
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

module.exports = db;
