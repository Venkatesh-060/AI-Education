import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddSessionModal from "../components/AddSessionModal";
import "../styles/SessionManagement.css";
import axios from "axios";

export default function SessionManagement() {
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);

  const [sessionList, setSessionList] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/session/all");

      setSessionList(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);
  const openModal = () => {
    setOpenPopup(true);
  };

  const closeModal = () => {
    setOpenPopup(false);
  };

  const addSession = async (sessionData) => {
    try {
      await axios.post("http://localhost:8080/api/session/create", sessionData);

      alert("Session Added Successfully");

      fetchSessions();
    } catch (error) {
      console.log(error);

      alert("Failed to add session");
    }
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/session/${id}`);

      alert("Session Deleted Successfully");

      fetchSessions();
    } catch (error) {
      console.log(error);
    }
  };

  const editSession = async (id) => {
    const sessionName = prompt("Enter Session Name");

    if (!sessionName) return;

    try {
      await axios.put(
        `http://localhost:8080/api/session/${id}`,

        {
          sessionName: sessionName,
        },
      );

      alert("Session Updated Successfully");

      fetchSessions();
    } catch (error) {
      console.log(error);
    }
  };

  const joinSession = (session) => {
    navigate("/classroom", {
      state: {
        roomId:session.id,
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
            <div className="sessionCard" key={item.id}>
              <div className="cardHeader">
                <div>
                  <h3>{item.sessionName}</h3>

                  <p>
                    <strong>Session ID :</strong> {item.id}
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
                  <h4>{item.trainerId}</h4>
                </div>

                <div className="infoCard">
                  <span>Batch</span>
                  <h4>{item.batchName}</h4>
                </div>

                <div className="infoCard">
                  <span>Date</span>
                  <h4>{item.sessionDate}</h4>
                </div>

                <div className="infoCard">
                  <span>Time</span>
                  <h4>{item.startTime}</h4>
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
                  onClick={() => joinSession(item)}
                >
                  Join Session
                </button>

                <button
                  className="editBtn"
                  onClick={() => editSession(item.id)}
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteSession(item.id)}
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
