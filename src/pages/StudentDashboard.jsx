import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/session/all");

      setSessions(response.data);
    } catch (error) {
      console.log(error);

      alert("Unable to load sessions");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token || role !== "STUDENT") {
      navigate("/");

      return;
    }

    fetchSessions();
  }, []);

  const joinSession = (id) => {
    navigate("/classroom", {
      state: {
        roomId: id,
      },
    });
  };

  return (
    <div className="studentDashboard">
      <h1>Student Dashboard</h1>

      <p>Available Live Sessions</p>

      {sessions.length === 0 ? (
        <h3>No sessions available</h3>
      ) : (
        sessions.map((item) => (
          <div className="studentCard" key={item.id}>
            <h2>{item.sessionName}</h2>

            <p>Batch : {item.batchName}</p>

            <p>Date : {item.sessionDate}</p>

            <p>Time : {item.startTime}</p>

            <p>Trainer : {item.trainerId}</p>

            <button onClick={() => joinSession(item.id)}>Join Class</button>
          </div>
        ))
      )}
    </div>
  );
}
