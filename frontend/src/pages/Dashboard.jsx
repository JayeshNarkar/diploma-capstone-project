import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import { useNavigate } from "react-router";
import checkCircleIcon from "../assets/check-circle.svg";
import exclamationCircleIcon from "../assets/exclamation-circle.svg";
import trashIcon from "../assets/trash.svg";
import listColumns from "../assets/list-columns.svg";
import LogoutButton from "../components/LogoutButton";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Dashboard() {
  let navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    ramTotal: 0,
    ramUsed: 0,
    ramUsage: 0,
  });

  const [diskMetrics, setDiskMetrics] = useState({
    diskTotal: 0,
  });

  const [cpuData, setCpuData] = useState({
    labels: [],
    datasets: [
      {
        label: "CPU Usage (%)",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const [diskData, setDiskData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverOffset: 25,
        hoverBackgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [systemResponse, diskResponse] = await Promise.all([
          fetch("/api/metrics/system"),
          fetch("/api/metrics/systemDisk"),
        ]);

        const systemData = await systemResponse.json();
        const diskData = await diskResponse.json();

        const ramUsage = (systemData.ramUsed / systemData.ramTotal) * 100;
        setMetrics({ ...systemData, ramUsage: ramUsage.toFixed(2) });

        setCpuData((prevData) => ({
          labels: [...prevData.labels, new Date().toLocaleTimeString()].slice(
            -10
          ),
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data, systemData.cpuUsage].slice(
                -10
              ),
            },
          ],
        }));

        const totalDisk = diskData.find((disk) => disk.totalAllDisks);

        setDiskMetrics({
          diskTotal: totalDisk.totalAllDisks.blocks,
          diskUsed: totalDisk.totalAllDisks.used,
          diskAvailable: totalDisk.totalAllDisks.available,
        });

        setDiskData({
          labels: ["Used", "Available"],
          datasets: [
            {
              data: [
                (totalDisk.totalAllDisks.used / 1024).toFixed(2),
                (totalDisk.totalAllDisks.available / 1024).toFixed(2),
              ],
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return null;
                }

                const usedDiskGradient = ctx.createRadialGradient(
                  (chartArea.left + chartArea.right) / 2,
                  (chartArea.top + chartArea.bottom) / 2,
                  0,
                  (chartArea.left + chartArea.right) / 2,
                  (chartArea.top + chartArea.bottom) / 2,
                  Math.max(
                    chartArea.right - chartArea.left,
                    chartArea.bottom - chartArea.top
                  ) / 2
                );

                usedDiskGradient.addColorStop(0, "#FF4500");
                usedDiskGradient.addColorStop(1, "#FFD700");

                const availableDiskGradient = ctx.createRadialGradient(
                  (chartArea.left + chartArea.right) / 2,
                  (chartArea.top + chartArea.bottom) / 2,
                  0,
                  (chartArea.left + chartArea.right) / 2,
                  (chartArea.top + chartArea.bottom) / 2,
                  Math.max(
                    chartArea.right - chartArea.left,
                    chartArea.bottom - chartArea.top
                  ) / 2
                );
                availableDiskGradient.addColorStop(0, "#00BFFF");
                availableDiskGradient.addColorStop(1, "#1E90FF");

                return [usedDiskGradient, availableDiskGradient];
              },
              hoverBackgroundColor: ["#FFDE89", "#60EFFF"],
              hoverOffset: 25,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const cpuOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: (context) => context.dataIndex !== 0,
        align: "top",
        color: "gray",
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      y: {
        type: "linear",
        min: 0,
        max: 100,
      },
    },
  };

  const memoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      datalabels: {
        display: false,
        align: "top",
        color: "gray",
        formatter: (value) =>
          `${((value / metrics.ramTotal) * 100).toFixed(2)}%`,
      },
    },
  };

  const formatMemory = (memory) => {
    memory = parseFloat(memory);
    if (memory > 2048) {
      return (memory / 1024).toFixed(2) + " GB";
    }
    return memory.toFixed(2) + " MB";
  };

  const formatNet = (net) => {
    net = parseFloat(net);
    if (net > 1024) {
      return (net / 1024).toFixed(2) + " mB";
    }
    return net + " kB";
  };

  const formatDisk = (disk) => {
    disk = disk / 1024;
    if (disk > 1024 * 1024) {
      return (disk / 1024 / 1024).toFixed(2) + " TB";
    }
    if (disk > 1024) {
      return (disk / 1024).toFixed(2) + " GB";
    }
    return disk.toFixed(2) + " MB";
  };

  const renderCpuUsage = () => (
    <div className="bg-gray-900 shadow-lg rounded-2xl w-full h-full flex flex-col items-center p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <h2 className="text-xl font-semibold text-center text-white">
        CPU Usage
      </h2>
      <div className="w-full h-64">
        <Line data={cpuData} options={cpuOptions} />
      </div>
    </div>
  );

  const renderMemoryUsage = () => (
    <div className="bg-gray-900 shadow-lg rounded-2xl w-full h-full flex flex-col items-center p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <h2 className="text-xl font-semibold text-center text-white">
        Memory Usage
      </h2>
      <div className="w-full h-64">
        <Pie data={memoryData} options={memoryOptions} />
      </div>
      <p className="text-center mt-2 text-white">
        <strong>Used:</strong> {formatMemory(metrics.ramUsed)} /{" "}
        <strong>Total:</strong> {formatMemory(metrics.ramTotal)}
      </p>
    </div>
  );

  const memoryData = {
    labels: ["Used Memory", "Free Memory"],
    datasets: [
      {
        data: [metrics.ramUsed, metrics.ramTotal - metrics.ramUsed],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const usedMemoryGradient = ctx.createRadialGradient(
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2,
            0,
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2,
            Math.max(
              chartArea.right - chartArea.left,
              chartArea.bottom - chartArea.top
            ) / 2
          );
          usedMemoryGradient.addColorStop(0, "#FF4500");
          usedMemoryGradient.addColorStop(1, "#FFD700");

          const freeMemoryGradient = ctx.createRadialGradient(
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2,
            0,
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2,
            Math.max(
              chartArea.right - chartArea.left,
              chartArea.bottom - chartArea.top
            ) / 2
          );
          freeMemoryGradient.addColorStop(0, "#00BFFF");
          freeMemoryGradient.addColorStop(1, "#1E90FF");

          return [usedMemoryGradient, freeMemoryGradient];
        },
        hoverBackgroundColor: ["#FFDE89", "#60EFFF"],
        hoverOffset: 25,
      },
    ],
  };

  const diskOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      datalabels: {
        display: false,
        align: "top",
        color: "gray",
        formatter: (value) =>
          `${((value / (diskMetrics.diskTotal / 1024)) * 100).toFixed(2)}%`,
      },
    },
  };

  const renderDiskUsage = () => (
    <div className="bg-gray-900 shadow-lg rounded-2xl w-full h-full flex flex-col items-center p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <h2 className="text-xl font-semibold text-center text-white">
        Disk Usage
      </h2>
      <div className="w-full h-64">
        <Pie data={diskData} options={diskOptions} />
      </div>
      <p className="text-center mt-2 text-white">
        <strong>Used:</strong> {formatDisk(diskMetrics.diskUsed)} /{" "}
        <strong>Total:</strong> {formatDisk(diskMetrics.diskTotal)}
      </p>
    </div>
  );

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await axios.get("/api/alerts");
        setAlerts(response.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await axios.post(`/api/alerts/${id}/acknowledge`);
      setAlerts(
        alerts.map((alert) =>
          alert.id === id ? { ...alert, acknowledged: 1 } : alert
        )
      );
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.post(`/api/alerts/${id}/remove`);
      setAlerts(alerts.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error removing alert:", error);
    }
  };

  const severityLabels = {
    1: "Critical",
    2: "High",
    3: "Moderate",
    4: "Low",
    5: "Informational",
  };

  const severityDescriptions = {
    1: "Critical (Immediate Action Required)",
    2: "High (Action Needed Soon)",
    3: "Moderate (Investigation Recommended)",
    4: "Low (Observation Only)",
    5: "Informational (No Action Needed)",
  };

  return (
    <div className="p-4 font-sans bg-gray-900 max-h-screen grid grid-cols-4 grid-rows-11 gap-4">
      <div className="flex justify-between content-between col-span-4 row-span-1">
        <div className="px-4 py-2 text-white bg-gray-800 rounded-lg self-end shadow-lg text-xl font-bold flex items-center border border-blue-500">
          <img
            src={listColumns}
            alt="Trash"
            className="w-6 h-6 mr-2 outline-white"
          />{" "}
          Dashboard
        </div>
        <div className="flex items-center justify-center content-center">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 self-end font-bold shadow-lg text-base mr-2 border border-gray-600 hover:border-blue-500 transition-all duration-300"
          >
            /
          </button>
          <LogoutButton />
        </div>
      </div>
      <div className="col-span-3 row-span-5">{renderCpuUsage()}</div>
      <div className="col-span-1 row-span-5 flex flex-col">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-900 p-4 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 flex-grow">
          <h2 className="text-xl font-semibold text-center text-white mb-2">
            Network Usage
          </h2>
          <div className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-green-400 rounded-2xl mb-2 flex-grow shadow-sm">
            <div className="m-2 text-green-800">
              {formatNet(metrics.bandwidthDownKb)}/s
            </div>
          </div>
          <div className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-red-400 rounded-2xl flex-grow shadow-sm">
            <div className="m-2 text-yellow-800">
              {formatNet(metrics.bandwidthUpKb)}/s
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 row-span-5 flex items-center justify-center">
        {renderMemoryUsage()}
      </div>
      <div className="col-span-1 row-span-5 flex items-center justify-center rounded-2xl bg-gray-900 shadow-lg border-gray-700 hover:border-blue-500 transition-all duration-300">
        {renderDiskUsage()}
      </div>
      <div className="col-span-2 row-span-5 flex flex-col rounded-2xl bg-gray-900 shadow-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300">
        <h2 className="text-xl font-bold text-white text-center">
          Alerts Table
        </h2>
        <div className="overflow-auto m-2 text-sm">
          <table className="min-w-full border-collapse shadow-lg overflow-hidden rounded-2xl bg-gray-850 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300">
            <thead>
              <tr className="text-white font-semibold bg-gradient-to-r from-gray-800 to-gray-700">
                <th className="font-bold border-r-2 border-gray-700 py-3 px-6 text-left">
                  Severity Level
                </th>
                <th className="font-bold border-x-2 border-b-2 border-gray-700 py-3 px-6 text-left">
                  Timestamp
                </th>
                <th className="font-bold border-x-2 border-b-2 border-gray-700 py-3 px-6 text-left">
                  Message
                </th>
                <th className="font-bold border-x-2 border-b-2 border-gray-700 py-3 px-6 text-left">
                  Effected PIDs
                </th>
                <th className="font-bold border-x-2 border-b-2 border-gray-700 py-3 px-6 text-center">
                  Acknowledge
                </th>
                <th className="font-bold border-gray-700 py-3 px-6 text-center">
                  Remove Alert
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="text-gray-300 bg-gray-800 hover:bg-gray-750 transition-all duration-200"
                >
                  <td
                    className="border-t-2 border-gray-700 px-6 py-4 text-left font-bold hover:text-blue-400 cursor-pointer"
                    title={severityDescriptions[alert.severity_level]}
                    onClick={() => {
                      navigate("/alert/" + alert.id);
                    }}
                  >
                    {alert.severity_level} -{" "}
                    {severityLabels[alert.severity_level]}
                  </td>
                  <td
                    className="border-x-2 border-t-2 border-gray-700 px-6 py-4 text-left hover:text-blue-400 cursor-pointer"
                    onClick={() => {
                      navigate("/alert/" + alert.id);
                    }}
                  >
                    {alert.timestamp}
                  </td>
                  <td
                    className="border-x-2 border-t-2 border-gray-700 px-6 py-4 text-left hover:text-blue-400 cursor-pointer"
                    onClick={() => {
                      navigate("/alert/" + alert.id);
                    }}
                  >
                    {alert.message}
                  </td>
                  <td
                    className="border-x-2 border-t-2 border-gray-700 px-6 py-4 text-left hover:text-blue-400 cursor-pointer"
                    onClick={() => {
                      navigate("/alert/" + alert.id);
                    }}
                  >
                    {JSON.parse(alert.effected_pids).map((pidInfo) => (
                      <div key={pidInfo.pid}>
                        {pidInfo.pid} - {pidInfo.name}
                      </div>
                    ))}
                  </td>
                  <td className="border-x-2 border-t-2 border-gray-700 py-4 px-6 text-center">
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <img
                        src={
                          alert.acknowledged === 1
                            ? checkCircleIcon
                            : exclamationCircleIcon
                        }
                        alt={
                          alert.acknowledged === 1
                            ? "Acknowledged"
                            : "Unacknowledged"
                        }
                        className={
                          alert.acknowledged === 1
                            ? "p-2 bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                            : "p-2 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        }
                      />
                    </button>
                  </td>
                  <td className="border-t-2 border-gray-700 py-4 px-6 text-center">
                    <button
                      onClick={() => handleRemove(alert.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                    >
                      <img src={trashIcon} alt="Trash" className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
