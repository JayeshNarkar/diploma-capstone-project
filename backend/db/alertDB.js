import Database from "better-sqlite3";
const alertsDb = new Database("alerts.db", { verbose: console.log });

alertsDb.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    severity_level INTEGER,
    message TEXT,
    effected_pids TEXT,
    acknowledged BOOLEAN DEFAULT 0,
    system_metrics TEXT,
    ai_message TEXT 
  )
`);

export default alertsDb;
