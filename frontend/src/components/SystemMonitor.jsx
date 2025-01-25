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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function SystemMonitor() {
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
          diskTotal:
            totalDisk.totalAllDisks.used + totalDisk.totalAllDisks.available,
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
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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
    <div className="bg-gray-800 shadow-md rounded-2xl w-full h-full flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold text-center text-white">
        CPU Usage
      </h2>
      <div className="w-full h-64">
        <Line data={cpuData} options={cpuOptions} />
      </div>
    </div>
  );

  const renderMemoryUsage = () => (
    <div className="bg-gray-800 shadow-md rounded-2xl w-full h-full flex flex-col items-center p-4">
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

  const renderNetworkUsage = () => (
    <>
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
    </>
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
          usedMemoryGradient.addColorStop(0, "#FF9D09");
          usedMemoryGradient.addColorStop(1, "#FFDE89");

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
          freeMemoryGradient.addColorStop(0, "#9DDDF4");
          freeMemoryGradient.addColorStop(1, "#60EFFF");

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
    <div className="bg-gray-800 shadow-md rounded-2xl w-full h-full flex flex-col items-center p-4">
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

  return (
    <div className="p-5 font-sans bg-gray-900 max-h-screen grid grid-cols-4 grid-rows-4 gap-4">
      <div className="col-span-3 row-span-2">{renderCpuUsage()}</div>
      <div className="col-span-1 row-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-4 shadow-md">
        {renderNetworkUsage()}
      </div>
      <div className="col-span-1 row-span-2 flex items-center justify-center">
        {renderMemoryUsage()}
      </div>
      <div className="col-span-1 row-span-2 flex items-center justify-center rounded-2xl bg-gray-800 shadow-md">
        {renderDiskUsage()}
      </div>
      <div className="col-span-2 row-span-2 flex items-center justify-center rounded-2xl bg-gray-800 shadow-md">
        <p className="text-white text-center">Fifth Component</p>
      </div>
    </div>
  );
}
