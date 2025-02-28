import React from "react";
import { useNavigate } from "react-router";
import { Boxes, Github, Home, LayoutDashboard, Users } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import AnimateTextUnderline from "../components/AnimateTextUnderline";

const Features = () => {
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

  const features = [
    {
      title: "Lightweight",
      description:
        "Our app is designed to be lightweight and efficient, ensuring minimal impact on system performance.",
      media: "/lightweight-demo.mp4",
    },
    {
      title: "SQLite Database",
      description:
        "We use SQLite for a reliable and self-contained database solution, perfect for embedded applications.",
      media: "/sqlite.png",
    },
    {
      title: "Responsive UI",
      description:
        "Our user interface is designed to be responsive and user-friendly, providing a seamless experience across all devices.",
      media: "/res_ui.mp4",
    },
    {
      title: "Real-time Monitoring",
      description:
        "Monitor system metrics in real-time, including CPU usage, RAM usage, and network bandwidth.",
      media: "/ex1.png",
    },
    {
      title: "Process Monitoring",
      description:
        "Keep track of running processes and fetch metrics for specific processes with ease.",
      media: "/ex2.png",
    },
    {
      title: "Secure and Reliable",
      description:
        "Your data is securely stored and protected, ensuring privacy and reliability.",
      media: "/secure-demo.mp4",
    },
  ];

  return (
    <div className="text-center bg-gradient-to-b from-gray-900 to-gray-800 w-screen h-screen font-sans overflow-auto">
      <div className="p-4 flex justify-between content-between items-center border-b-2 border-gray-700">
        <div className="px-4 py-2 text-white bg-gray-800 rounded-lg self-center shadow-lg text-xl font-bold flex items-center border border-blue-500">
          <Boxes className="w-6 h-6 mr-1" />
          Features
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 h-[calc(100vh-10rem)]">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-lg shadow-lg bg-gray-850 border-2 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30 transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">
              {feature.title}
            </h2>
            <hr className="border-2 border-blue-500 mb-4" />
            <p className="text-gray-300">{feature.description}</p>
            <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
              {feature.media.endsWith(".mp4") ? (
                <video
                  src={feature.media}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <img
                  src={feature.media}
                  alt={feature.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t-2 border-gray-700">
        <p className="text-gray-400">© 2025 CloudGuard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Features;
