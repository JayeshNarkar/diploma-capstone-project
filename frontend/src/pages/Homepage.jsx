import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Github, Home, LayoutDashboard, Users, Boxes } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import AnimateTextUnderline from "../components/AnimateTextUnderline";

const Homepage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/verify-session", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="text-center bg-gradient-to-b from-gray-900 to-gray-800 w-screen h-screen font-sans overflow-auto">
      <div className="p-4 flex justify-between content-between items-center border-b-2 border-gray-700">
        <div className="flex items-center justify-start text-center text-white font-semibold font-mono text-2xl">
          <img
            src={"/logo.png"}
            className="w-14 h-14 mr-2 bg-white rounded-full p-1 border-sky-500 border-2"
          />
          CloudGuard
        </div>
        <div className="flex content-center justify-center">
          <button
            className="flex items-center mr-2 text-xl text-gray-300 px-4 py-2 whitespace-nowrap font-semibold transition-all duration-300"
            onClick={() => {
              navigate("/");
            }}
          >
            <Home className="w-6 h-6 mr-1" />{" "}
            <AnimateTextUnderline text={"Home"} />
          </button>
          {isAuthenticated && (
            <button
              className="flex items-center mr-2 text-xl text-gray-300 px-4 py-2 whitespace-nowrap font-semibold transition-all duration-300"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              <LayoutDashboard className="w-6 h-6 mr-1" />
              <AnimateTextUnderline text={"Dashboard"} />
            </button>
          )}
          <button
            className="flex items-center mr-2 text-xl text-gray-300 px-4 py-2 whitespace-nowrap font-semibold transition-all duration-300"
            onClick={() => {
              navigate("/features");
            }}
          >
            <Boxes className="w-6 h-6 mr-1" />
            <AnimateTextUnderline text={"Features"} />
          </button>
          <button
            className="flex items-center mr-2 text-xl text-gray-300 px-4 py-2 whitespace-nowrap font-semibold transition-all duration-300"
            onClick={() => {
              navigate("/about-us");
            }}
          >
            <Users className="w-6 h-6 mr-1" />{" "}
            <AnimateTextUnderline text={"About Us"} />
          </button>
          <a
            href="https://github.com/JayeshNarkar/diploma-capstone-project"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xl text-gray-300 px-4 py-2 whitespace-nowrap font-semibold transition-all duration-300"
          >
            <Github className="w-6 h-6 mr-1" />{" "}
            <AnimateTextUnderline text={"GitHub"} />
          </a>
        </div>
        {isAuthenticated ? (
          <div className="ml-44 flex items-center">
            <LogoutButton />
          </div>
        ) : (
          <button
            className=" ml-44 text-xl border-2 border-blue-500 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2 whitespace-nowrap text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <h1 className="font-bold text-4xl text-white mb-4">
          Protecting Your Cloud, Detecting the Unseen
        </h1>

        <div className="flex justify-center items-center my-6">
          <img
            src="/ex1.png"
            alt="Example 1"
            style={{ transform: "rotate(-5deg)", marginRight: "20px" }}
            className=" h-72 object-cover rounded-lg shadow-lg"
          />
          <img
            src="/ex2.png"
            alt="Example 2"
            style={{ transform: "rotate(5deg)" }}
            className=" h-72 object-cover rounded-lg shadow-lg"
          />
        </div>

        <p className="text-xl font-semibold text-gray-300 my-6">
          Our system monitoring tool with anomaly and threat detection features
          is lightweight, uses SQLite database, and offers a responsive and
          user-friendly UI.
        </p>
        <button
          className="text-base border-2 border-blue-500 bg-gray-800 hover:bg-gray-700 rounded-xl py-2 px-6 whitespace-nowrap text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          onClick={() => {
            navigate("/login");
          }}
        >
          Get Started!
        </button>
      </div>

      <div className="p-4 border-t-2 border-gray-700">
        <p className="text-gray-400">© 2025 CloudGuard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Homepage;
