import "./App.css";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Alert from "./pages/Alert";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alert/:id" element={<Alert />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
