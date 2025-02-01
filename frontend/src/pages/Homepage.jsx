import React from "react";
import { useNavigate } from "react-router";
import Logo from "../assets/logo.png";

const Homepage = () => {
  let navigate = useNavigate();

  const handleGettingStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="text-center bg-gradient-to-b from-slate-400 to-gray-600 w-screen h-screen font-sans">
      <div className="p-3 justify-between border-b-4 border-white flex mb-2">
        <div className="flex items-center justify-start text-center text-xl text-gray-600 font-semibold w-full font-mono">
          <img
            src={Logo}
            className="w-12 h-12 mr-2 bg-white rounded-full p-1"
          />
          System Monitor & Anomaly Detector
        </div>
        <button
          className="text-base border-2 bg-gray-800 hover:bg-gray-900 rounded-xl px-4  whitespace-nowrap text-white font-semibold"
          onClick={handleGettingStarted}
        >
          Login
        </button>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-6 py-2">
          <h1 className="font-bold text-3xl text-white">
            Welcome to Anomaly and Threat Detection System
          </h1>
          <div className="flex col-span-6 items-center content-center justify-center"></div>
          <p className="text-xl font-semibold m-3 text-gray-300 text-center">
            Our system monitoring tool with anomaly and threat detection
            features is lightweight, uses SQLite database, and offers a
            responsive and user-friendly UI.
          </p>
          <button
            className="text-base border-2 bg-gray-800 hover:bg-gray-900 rounded-xl py-2 px-4  whitespace-nowrap text-white font-semibold"
            onClick={handleGettingStarted}
          >
            Get Started!
          </button>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">Lightweight</h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            Our app is designed to be lightweight and efficient, ensuring
            minimal impact on system performance.
          </p>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">SQLite Database</h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            We use SQLite for a reliable and self-contained database solution,
            perfect for embedded applications.
          </p>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">Responsive UI</h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            Our user interface is designed to be responsive and user-friendly,
            providing a seamless experience across all devices.
          </p>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">
            Real-time Monitoring
          </h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            Monitor system metrics in real-time, including CPU usage, RAM usage,
            and network bandwidth.
          </p>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">Process Monitoring</h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            Keep track of running processes and fetch metrics for specific
            processes with ease.
          </p>
        </div>
        <div className="p-4 m-3 rounded-lg shadow-md border-primary border-2 col-span-1 bg-gray-600 text-white">
          <h2 className="md:text-xl font-semibold mb-2">Secure and Reliable</h2>
          <hr className="border-2 border-primary m-2" />
          <p className="opacity-75">
            Your data is securely stored and protected, ensuring privacy and
            reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
