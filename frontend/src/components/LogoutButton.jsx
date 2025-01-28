import React from "react";
import { useNavigate } from "react-router";

const LogoutButton = () => {
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        alert("Failed to logout");
      }
    } catch (error) {
      alert("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 m-1 w-1/3 self-end font-bold shadow-md text-base"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
