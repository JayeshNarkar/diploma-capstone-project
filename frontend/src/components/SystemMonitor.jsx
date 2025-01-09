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

  const [cpuData, setCpuData] = useState({
    labels: [],
    datasets: [
      {
        label: "CPU Usage (%)",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.4,
      },
    ],
  });
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
    plugins: {
      datalabels: {
        display: true,
        align: "top",
        color: "gray",
        formatter: (value) =>
          `${((value / metrics.ramTotal) * 100).toFixed(2)}%`,
      },
    },
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics/system");
        const data = await response.json();
        const ramUsage = (data.ramUsed / data.ramTotal) * 100;
        setMetrics({ ...data, ramUsage: ramUsage.toFixed(2) });

        setCpuData((prevData) => ({
          labels: [...prevData.labels, new Date().toLocaleTimeString()].slice(
            -10
          ),
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data, data.cpuUsage].slice(-10),
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const renderCpuUsage = () => (
    <div className="bg-gray-200 shadow-md rounded-lg w-full h-full flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold text-center">CPU Usage</h2>
      <div className="w-full h-64">
        <Line data={cpuData} options={cpuOptions} />
      </div>
    </div>
  );

  const renderMemoryUsage = () => (
    <div className="bg-gray-200 shadow-md rounded-lg w-full h-full flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold text-center">Memory Usage</h2>
      <div className="w-full h-64">
        <Pie data={memoryData} options={memoryOptions} />
      </div>
      <p className="text-center mt-2">
        <strong>Used:</strong> {formatMemory(metrics.ramUsed)} /{" "}
        <strong>Total:</strong> {formatMemory(metrics.ramTotal)}
      </p>
    </div>
  );

  const renderNetworkUsage = () => (
    <div className="col-span-1 row-span-2 flex flex-col items-center justify-center rounded-md bg-gray-200 p-4 m-2">
      <div className="w-full flex items-center justify-center bg-green-200 rounded-md mb-2 flex-grow">
        <div className="m-2 text-green-800">
          {formatNet(metrics.bandwidthDownKb)}/s
        </div>
      </div>
      <div className="w-full flex items-center justify-center bg-yellow-200 rounded-md flex-grow">
        <div className="m-2 text-yellow-800">
          {formatNet(metrics.bandwidthUpKb)}/s
        </div>
      </div>
    </div>
  );

  const memoryData = {
    labels: ["Used Memory", "Free Memory"],
    datasets: [
      {
        data: [metrics.ramUsed, metrics.ramTotal - metrics.ramUsed],
        backgroundColor: ["#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-5 font-sans bg-gray-600 max-h-screen grid grid-cols-4 grid-rows-4 gap-4">
      <div className="col-span-3 row-span-2">{renderCpuUsage()}</div>
      {renderNetworkUsage()}
      <div className="col-span-1 row-span-2 flex items-center justify-center">
        {renderMemoryUsage()}
      </div>
      <div className="col-span-3 row-span-2 flex items-center justify-center rounded-md bg-gray-200">
        <p className="text-black text-center">Fourth Component</p>
      </div>
    </div>
  );
}
