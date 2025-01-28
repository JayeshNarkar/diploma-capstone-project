import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/verify-session", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          navigate("/dashboard");
        } else {
          fetch("/api/password-status")
            .then((response) => response.text())
            .then((data) => {
              if (data === "Password is set") {
                setIsFirstVisit(false);
              } else {
                setIsFirstVisit(true);
              }
            })
            .catch((error) => {
              console.error("Error checking password status:", error);
            });
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isFirstVisit
      ? "/api/set-password"
      : "/api/verify-password";
    const payload = { password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await response.text();
        alert(errorData || "Failed to authenticate");
      }
    } catch (error) {
      alert("Failed to authenticate");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]  from-gray-100 to-blue-300">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border-2 border-gray-500">
          <h2 className="text-2xl font-bold text-center">
            {isFirstVisit ? "Set your password" : "Enter your password"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 my-4"></p>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 "
            >
              {isFirstVisit ? "Set Password" : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div
        className="border-l-4 border-gray-500 w-2/3 bg-cover bg-center"
        style={{ backgroundImage: 'url("bg.jpg")' }}
      ></div>
    </div>
  );
};

export default Login;
