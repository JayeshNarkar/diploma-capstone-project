import "./App.css";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Alert from "./pages/Alert";
import Features from "./pages/Features";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alert/:id" element={<Alert />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
