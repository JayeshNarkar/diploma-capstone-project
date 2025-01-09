import Database from "better-sqlite3";
const alertsDb = new Database("alerts.db", { verbose: console.log });

alertsDb.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    severity_level INTEGER,
    message TEXT,
    effected_pids TEXT
  )
`);

export default alertsDb;
