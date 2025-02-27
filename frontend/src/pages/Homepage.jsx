import React from "react";
import { useNavigate } from "react-router";

const Homepage = () => {
  let navigate = useNavigate();

  const handleGettingStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="text-center bg-gradient-to-b from-gray-900 to-gray-800 w-screen h-screen font-sans overflow-auto">
      <div className="p-4 flex justify-between items-center border-b-2 border-gray-700">
        <div className="flex items-center justify-start text-center text-white font-semibold w-full font-mono text-2xl">
          <img
            src={"/logo.png"}
            className="w-14 h-14 mr-2 bg-white rounded-full p-1 border-gray-700 border-2"
          />
          CloudGuard
        </div>
        <button
          className="text-base border-2 border-blue-500 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2 whitespace-nowrap text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          onClick={handleGettingStarted}
        >
          Login
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        <div className="col-span-full">
          <h1 className="font-bold text-4xl text-white mb-4">
            Protecting Your Cloud, Detecting the Unseen
          </h1>
          <p className="text-xl font-semibold text-gray-300 mb-6">
            Our system monitoring tool with anomaly and threat detection
            features is lightweight, uses SQLite database, and offers a
            responsive and user-friendly UI.
          </p>
          <button
            className="text-base border-2 border-blue-500 bg-gray-800 hover:bg-gray-700 rounded-xl py-2 px-6 whitespace-nowrap text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            onClick={handleGettingStarted}
          >
            Get Started!
          </button>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Lightweight
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            Our app is designed to be lightweight and efficient, ensuring
            minimal impact on system performance.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            SQLite Database
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            We use SQLite for a reliable and self-contained database solution,
            perfect for embedded applications.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Responsive UI
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            Our user interface is designed to be responsive and user-friendly,
            providing a seamless experience across all devices.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Real-time Monitoring
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            Monitor system metrics in real-time, including CPU usage, RAM usage,
            and network bandwidth.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Process Monitoring
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            Keep track of running processes and fetch metrics for specific
            processes with ease.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Secure and Reliable
          </h2>
          <hr className="border-2 border-blue-500 mb-4" />
          <p className="text-gray-300">
            Your data is securely stored and protected, ensuring privacy and
            reliability.
          </p>
        </div>
      </div>

      <div className="p-4 border-t-2 border-gray-700">
        <p className="text-gray-400">
          © 2025 System Monitor & Anomaly Detector. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Homepage;
