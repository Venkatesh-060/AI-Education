import React, { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import ClassroomChat from "../components/ClassroomChat";
import "../styles/DigitalClassroom.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function DigitalClassroom() {
  const [initialData, setInitialData] = useState({
    elements: [],
  });
  const location = useLocation();

  const navigate = useNavigate();

  const sessionId = location.state?.roomId;

  if (!sessionId) {
    return (
      <div>
        <h2>No session selected.</h2>
      </div>
    );
  }
  console.log("Session ID:", sessionId);
  // MARK JOIN ATTENDANCE

  const markAttendance = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role !== "STUDENT") {
        return;
      }

      const userId = localStorage.getItem("userId");

      if (!userId || !sessionId) {
        console.log("Missing user or session");
        return;
      }

      await axios.post(
        "http://localhost:8080/api/attendance/mark",

        {
          userId: userId,

          sessionId: sessionId,

          joinTime: new Date().toISOString().slice(0, 19),

          status: "Present",
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Attendance marked");
    } catch (error) {
      console.log("Attendance Error", error.response?.data);
    }
  };

  // UPDATE LEAVE TIME AND DURATION

  const updateLeaveAttendance = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role !== "STUDENT") {
        return;
      }

      const userId = localStorage.getItem("userId");

      await axios.put(
        "http://localhost:8080/api/attendance/update",

        {
          userId: userId,

          sessionId: sessionId,

          leaveTime: new Date().toISOString().slice(0, 19),

          status: "Present",
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Leave attendance updated");
    } catch (error) {
      console.log("Leave Error", error.response?.data);
    }
  };

  // LEAVE CLASS BUTTON

  const leaveClass = async () => {
    await updateLeaveAttendance();

    const role = localStorage.getItem("role");

    if (role === "TRAINER") {
      navigate("/trainer-dashboard");
    } else if (role === "STUDENT") {
      navigate("/student-dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("whiteboard");

    if (savedData) {
      setInitialData({
        elements: JSON.parse(savedData),
      });
    }
  }, []);

  const handleChange = (elements) => {
    localStorage.setItem(
      "whiteboard",

      JSON.stringify(elements),
    );
  };

  return (
    <div className="digitalContainer">
      <div className="whiteboardSection">
        <h2>Whiteboard Development Sandbox</h2>

        <div className="whiteboardBox">
          <Excalidraw
            theme="light"
            initialData={initialData}
            onChange={handleChange}
          />
        </div>

        <button className="leaveBtn" onClick={leaveClass}>
          Leave Classroom
        </button>
      </div>

      <div className="chatSection">
        <ClassroomChat sessionId={sessionId} />
      </div>
    </div>
  );
}
