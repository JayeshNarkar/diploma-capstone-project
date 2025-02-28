import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";

const ProtectedRoute = () => {
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
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center content-center justify-center min-h-screen min-w-screen">
        Loading...
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
