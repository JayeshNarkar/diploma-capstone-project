import React from "react";
import { useNavigate } from "react-router";
import { Boxes, Github, Home, LayoutDashboard, Users } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import AnimateTextUnderline from "../components/AnimateTextUnderline";

const AboutUs = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
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

  const teamMembers = [
    {
      name: "Jayesh Narkar",
      role: "JS Developer",
      image: "/jayesh.jpg",
    },
    {
      name: "Somesh Tiwari",
      role: "UI & UX Designer",
      image: "/somesh.jpg",
    },
    {
      name: "Shreya Pawar",
      role: "Python Developer",
      image: "/shreya.jpeg",
    },
    {
      name: "Sweety Tiwari",
      role: "System Designer",
      image: "/sweety.jpeg",
    },
  ];

  return (
    <div className="text-center bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen font-sans overflow-auto">
      <div className="p-4 flex justify-between content-between items-center border-b-2 border-gray-700">
        <div className="px-4 py-2 text-white bg-gray-800 rounded-lg self-center shadow-lg text-xl font-bold flex items-center border border-blue-500">
          <Users className="w-6 h-6 mr-1" />
          About Us
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

      <div className="py-4 flex-1">
        <h1 className="font-bold text-4xl text-white">About Us</h1>
        <p className="text-xl font-semibold text-gray-300 mb-4">
          We are a passionate team of developers and engineers dedicated to
          building innovative solutions for system monitoring and anomaly
          detection.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto ">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-850 p-4 rounded-xl shadow-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className=" w-36 h-36 rounded-md mx-auto mb-2 border-2 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-white mb-1">
                {member.name}
              </h2>
              <p className="text-gray-300 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t-2 border-gray-700">
        <p className="text-gray-400">© 2025 CloudGuard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AboutUs;
