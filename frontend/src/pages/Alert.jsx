import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import exclamationTriangle from "../assets/exclamation-triangle.svg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const severityColors = {
  1: "text-red-500 border-red-500",
  2: "text-red-500 border-red-500",
  3: "text-orange-500 border-orange-500",
  4: "text-yellow-500 border-yellow-500",
  5: "text-yellow-500 border-yellow-500",
};

const severityDescriptions = {
  1: "Critical (Immediate Action Required)",
  2: "High (Action Needed Soon)",
  3: "Moderate (Investigation Recommended)",
  4: "Low (Observation Only)",
  5: "Informational (No Action Needed)",
};

const Alert = () => {
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [effectedPids, setEffectedPids] = useState([]);
  const [aiMessage, setAiMessage] = useState("");

  const navigate = useNavigate();

  const formatNet = (net) => {
    net = parseFloat(net);
    if (net > 1024) {
      return (net / 1024).toFixed(2) + " mB/s";
    }
    return net + " kB/s";
  };

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const response = await fetch(`/api/alerts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch alert");
        }
        const data = await response.json();
        setAlert(data);

        const systemMetrics = JSON.parse(data.system_metrics);
        const ramUsedPercentage = (
          (systemMetrics.ramUsed / systemMetrics.ramTotal) *
          100
        ).toFixed(2);
        setMetrics({
          ...systemMetrics,
          ramUsedPercentage: ramUsedPercentage,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlert();
  }, [id]);

  useEffect(() => {
    try {
      if (typeof alert.effected_pids === "string") {
        try {
          setEffectedPids(JSON.parse(alert.effected_pids));
        } catch (e) {
          console.error("Failed to parse effected_pids:", e);
        }
      } else {
        setEffectedPids(alert.effected_pids);
      }
    } catch (error) {
      console.log(error);
    }
  }, [alert]);

  useEffect(() => {
    const fetchAiMessage = async () => {
      try {
        const response = await fetch(`/api/alerts/${id}/ai-message`);
        if (!response.ok) {
          throw new Error("Failed to fetch AI message");
        }
        const data = await response.json();
        setAiMessage(data.ai_message);
      } catch (error) {
        console.error("Error fetching AI message:", error);
      }
    };

    if (alert) {
      fetchAiMessage();
    }
  }, [alert, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-red-500 text-xl font-semibold">
        Error: {error} (Alert ID: {id})
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white justify-center grid grid-cols-2 grid-rows-11 gap-4">
      {/* Header */}
      <div className="flex justify-between content-between col-span-4 row-span-1">
        <div className="px-4 py-2 text-white bg-gray-800 rounded-lg self-end shadow-lg text-xl font-bold flex items-center border-2 border-gray-700 hover:border-blue-500 transition-all duration-300">
          <img src={exclamationTriangle} alt="Alert" className="w-6 h-6 mr-2" />{" "}
          Alert - {id}
        </div>
        <div className="flex items-center justify-center content-center">
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 self-end font-bold shadow-lg text-base mr-2 border-2 border-gray-600 hover:border-blue-500 transition-all duration-300"
          >
            /dashboard
          </button>
        </div>
      </div>
      {alert ? (
        <>
          <div className="w-full bg-gray-850 p-6 rounded-xl shadow-lg col-span-1 row-span-10 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300">
            <h1 className="text-3xl font-bold border-b border-gray-600 pb-4 mb-4">
              Alert Details
            </h1>
            <p className="mb-2">
              <span className="font-semibold">Severity Level:</span>
              <span
                className={`ml-2 px-2 py-1 border rounded ${
                  severityColors[alert.severity_level]
                }`}
              >
                {alert.severity_level} -{" "}
                {severityDescriptions[alert.severity_level]}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Timestamp:</span>{" "}
              {alert.timestamp}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Message:</span> {alert.message}
            </p>

            <div className="mb-4 overflow-auto">
              <span className="font-semibold">Effected Processes (id):</span>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-auto max-h-96">
                {Array.isArray(effectedPids) ? (
                  effectedPids.map((process, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        <strong>PID:</strong> {process.pid}
                      </p>
                      <p>
                        <strong>Name:</strong> {process.name}
                      </p>
                      <p>
                        <strong>Command:</strong> {process.cmd}
                      </p>
                      <p>
                        <strong>PPID:</strong> {process.ppid}
                      </p>
                      <p>
                        <strong>UID:</strong> {process.uid}
                      </p>
                      <p>
                        <strong>CPU:</strong> {process.cpu}
                      </p>
                      <p>
                        <strong>Memory:</strong> {process.memory}
                      </p>
                      {index < effectedPids.length - 1 &&
                        effectedPids.length > 1 && <hr className="my-2" />}
                    </div>
                  ))
                ) : (
                  <p>No effected processes available.</p>
                )}
              </pre>
            </div>
          </div>
          <div className="w-full bg-gray-850 p-6 rounded-xl shadow-lg col-span-1 row-span-10 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-2">
                System Metrics
              </h2>
            </div>
            {metrics && (
              <table className="w-full text-left border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 px-4 py-2">Metric</th>
                    <th className="border border-gray-700 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      CPU Usage
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {metrics.cpuUsage}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      RAM Used
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {metrics.ramUsedPercentage}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      Bandwidth Down
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {formatNet(metrics.bandwidthDownKb)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      Bandwidth Up
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {formatNet(metrics.bandwidthUpKb)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-2">
                AI Message
              </h2>
              {aiMessage ? (
                <div className="overflow-auto max-h-60 text-wrap bg-gray-800 p-4 rounded-lg">
                  <Markdown remarkPlugins={[remarkGfm]}>{aiMessage}</Markdown>
                </div>
              ) : (
                <div className="text-center h-60 w-full items-center">
                  <p>Loading...</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400">Alert not found</p>
      )}
    </div>
  );
};

export default Alert;
