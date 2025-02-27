import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isEmailSet, setIsEmailSet] = useState(false);
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

          fetch("/api/email-status")
            .then((response) => response.text())
            .then((data) => {
              if (data === "Email is set") {
                setIsEmailSet(true);
              } else {
                setIsEmailSet(false);
              }
            })
            .catch((error) => {
              console.error("Error checking email status:", error);
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
        if (!isEmailSet) {
          const emailResponse = await fetch("/api/set-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
            credentials: "include",
          });

          if (!emailResponse.ok) {
            const errorData = await emailResponse.text();
            alert(errorData || "Failed to set email");
            return;
          }
        }
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isFirstVisit ? "Welcome!" : "Welcome Back!"}
          </h2>
          <p className="text-gray-300 mt-2">
            {isFirstVisit
              ? "Set up your account to get started."
              : "Sign in to continue."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEmailSet && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-700 text-white"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            {isFirstVisit ? "Set Password" : "Sign In"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-300">
          {isFirstVisit && (
            <p>By setting a password, you agree to our terms and conditions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
