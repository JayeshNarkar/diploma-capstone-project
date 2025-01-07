# Anomaly and Threat Detection System

This project is a system monitoring tool with plans to implement anomaly and threat detection features. It consists of a backend server that collects system metrics and a frontend dashboard to display these metrics.

## Features

- **System Monitoring**: Collects CPU usage, RAM usage, and network bandwidth statistics.
- **Process Monitoring**: Lists running processes and fetches metrics for specific processes.
- **Frontend Dashboard**: Displays system metrics in a user-friendly interface.

## Technologies Used

- **Backend**: Node.js, Express, Better-SQLite3, node-os-utils, ps-list
- **Frontend**: React
- **Database**: SQLite

## Setup Instructions

1. **Clone the repository**:
   ```
   https://github.com/JayeshNarkar/diploma-capstone-project.git
   cd capstone-project
   ```

**Backend**:

2. **Install dependencies**:

```
cd backend
npm i
```

3.**Run the project**:

```
node index.js
```

**Frontend**:

2. **Install dependencies**:

```
cd backend
npm i
```

3.**Run the project**:

```
npm run dev
```

## Backend routes

- **GET** /metrics/system: Fetches system metrics (CPU usage, RAM usage, network bandwidth).

- **GET** /metrics/:pid: Fetches metrics for a specific process by PID.

- **GET** /ps: Lists all running processes.
