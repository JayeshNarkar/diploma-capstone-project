import "./App.css";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
