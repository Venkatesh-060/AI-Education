import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddSessionModal from "../components/AddSessionModal";
import "../styles/SessionManagement.css";

export default function SessionManagement() {
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);

  const [sessionList, setSessionList] = useState([
    {
      sessionId: "SES1001",
      sessionName: "React Basics",
      trainerName: "Venkatesan",
      date: "2026-07-12",
      time: "10:00 AM",
      duration: "60",
      description: "Introduction to React",
      status: "Upcoming",
    },
    {
      sessionId: "SES1002",
      sessionName: "Java Full Stack",
      trainerName: "Naveen Kumar",
      date: "2026-07-14",
      time: "11:30 AM",
      duration: "90",
      description: "Backend Development",
      status: "Live",
    },
    {
      sessionId: "SES1003",
      sessionName: "Python",
      trainerName: "Amritha",
      date: "2026-07-08",
      time: "02:00 PM",
      duration: "45",
      description: "Python Basics",
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const openModal = () => {
    setOpenPopup(true);
  };

  const closeModal = () => {
    setOpenPopup(false);
  };

  const addSession = (sessionData) => {
    setSessionList([...sessionList, sessionData]);
  };

  const deleteSession = (id) => {
    const newList = sessionList.filter((item) => item.sessionId !== id);

    setSessionList(newList);

    alert("Session Deleted Successfully.");
  };

  const editSession = (id) => {
    const sessionName = prompt("Enter New Session Name");

    if (!sessionName) return;

    const trainerName = prompt("Enter Trainer Name");

    if (!trainerName) return;

    const newList = sessionList.map((item) => {
      if (item.sessionId === id) {
        return {
          ...item,
          sessionName,
          trainerName,
        };
      }

      return item;
    });

    setSessionList(newList);

    alert("Session Updated Successfully.");
  };

  const joinSession = (id) => {
    navigate("/classroom", {
      state: {
        roomId: id,
      },
    });
  };

  const filteredSessions = sessionList.filter((item) => {
    const matchSearch = item.sessionName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || item.status === statusFilter;

    const matchDate = dateFilter === "" || item.date === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="sessionPage">
      <div className="sessionTop">
        <div>
          <h1>Session Management</h1>
          <p>Manage all scheduled classroom sessions.</p>
        </div>

        <button className="addSessionBtn" onClick={openModal}>
          + Add New Session
        </button>
      </div>

      <div className="dashboardCards">
        <div className="dashCard">
          <h2>{sessionList.length}</h2>
          <p>Total Sessions</p>
        </div>

        <div className="dashCard">
          <h2>
            {sessionList.filter((item) => item.status === "Upcoming").length}
          </h2>
          <p>Upcoming</p>
        </div>

        <div className="dashCard">
          <h2>{sessionList.filter((item) => item.status === "Live").length}</h2>
          <p>Live Sessions</p>
        </div>

        <div className="dashCard">
          <h2>
            {sessionList.filter((item) => item.status === "Completed").length}
          </h2>
          <p>Completed</p>
        </div>
      </div>

      <div className="filterSection">
        <input
          type="text"
          placeholder="Search Session..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Upcoming</option>
          <option>Live</option>
          <option>Completed</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Session List */}

      <div className="sessionList">
        {filteredSessions.length === 0 ? (
          <div className="emptyBox">
            <h3>No Sessions Found</h3>
            <p>No matching sessions available.</p>
          </div>
        ) : (
          filteredSessions.map((item) => (
            <div className="sessionCard" key={item.sessionId}>
              <div className="cardHeader">
                <div>
                  <h3>{item.sessionName}</h3>

                  <p>
                    <strong>Session ID :</strong> {item.sessionId}
                  </p>
                </div>

                <span
                  className={`statusBadge ${
                    item.status === "Upcoming"
                      ? "upcoming"
                      : item.status === "Live"
                        ? "live"
                        : "completed"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="infoGrid">
                <div className="infoCard">
                  <span>Trainer</span>
                  <h4>{item.trainerName}</h4>
                </div>

                <div className="infoCard">
                  <span>Date</span>
                  <h4>{item.date}</h4>
                </div>

                <div className="infoCard">
                  <span>Time</span>
                  <h4>{item.time}</h4>
                </div>

                <div className="infoCard">
                  <span>Duration</span>
                  <h4>{item.duration} Minutes</h4>
                </div>

                <div className="infoCard">
                  <span>Description</span>
                  <h4>{item.description}</h4>
                </div>
              </div>

              <div className="buttonSection">
                <button
                  className="joinBtn"
                  onClick={() => joinSession(item.sessionId)}
                >
                  Join Session
                </button>

                <button
                  className="editBtn"
                  onClick={() => editSession(item.sessionId)}
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteSession(item.sessionId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Session Modal */}

      {openPopup && (
        <AddSessionModal closeModal={closeModal} addSession={addSession} />
      )}
    </div>
  );
}
