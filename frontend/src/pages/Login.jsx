import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const savedPassword = Cookies.get("password");
    if (!savedPassword) {
      setIsFirstVisit(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedPassword = Cookies.get("password");
    if (isFirstVisit) {
      Cookies.set("password", password, { expires: 365 });
      navigate("/dashboard");
    } else {
      if (password === savedPassword) {
        navigate("/dashboard");
      } else {
        alert("Incorrect password");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-blue-200">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">
            {isFirstVisit ? "Set your password" : "Enter your password"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 my-4"></p>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
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
