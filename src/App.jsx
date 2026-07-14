import React from "react";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DigitalClassroom from "./pages/DigitalClassroom";
import TrainerDashboard from "./pages/TrainerDashboard";
import Recordings from "./pages/Recordings";
import SessionRecordings from "./pages/SessionRecordings";
import SessionManagement from "./pages/SessionManagement";
import Attendance from "./pages/Attendance";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/classroom" element={<DigitalClassroom />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/session-recordings" element={<SessionRecordings />} />
        <Route path="/session-management" element={<SessionManagement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
