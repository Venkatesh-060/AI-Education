import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSessionModal from "../components/CreateSessionModal";
import "../styles/TrainerDashboard.css";

export default function TrainerDashboard() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [sessionList, setSessionList] = useState([]);

  const openPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  const saveSession = (sessionData) => {
    setSessionList([...sessionList, sessionData]);
  };

  const notifyBtnClick = (id) => {
    const newList = sessionList.map((item) => {
      if (item.roomId === id) {
        item.notified = true;
      }
      return item;
    });

    setSessionList(newList);

    alert("Students notified successfully.");
  };

  const startClass = (id) => {
    navigate("/classroom", {
      state: {
        roomId: id,
      },
    });
  };

  const openRecordings = () => {
    navigate("/recordings");
  };

  const openSessionRecordings = () => {
    navigate("/session-recordings");
  };

  const openSessionManagement = () => {
  navigate("/session-management");
};

  return (
    <div className="dashboard">
      {/* Header */}

      <div className="topBox">
        <div>
          <h1>Trainer Dashboard</h1>
          <p>Manage your live classes easily.</p>
        </div>

        <div className="headerButtons">
          <button
            className="recordBtn"
            onClick={openSessionManagement}
          >
            Session Management
          </button>

          <button
            className="recordBtn"
            onClick={openRecordings}
          >
            Upload Recordings
          </button>

          <button
            className="recordBtn"
            onClick={openSessionRecordings}
          >
            Session Recordings
          </button>

          <button
            className="createSessionBtn"
            onClick={openPopup}
          >
            + Create Live Session
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}

      <div className="cardSection">
        <div className="topCard">
          <h2>{sessionList.length}</h2>
          <p>Total Sessions</p>
        </div>

        <div className="topCard">
          <h2>
            {sessionList.filter((item) => item.notified).length}
          </h2>
          <p>Students Notified</p>
        </div>

        <div className="topCard">
          <h2>
            {sessionList.filter((item) => !item.notified).length}
          </h2>
          <p>Pending Sessions</p>
        </div>
      </div>

      {/* Session List */}

      <div className="sessionBox">
        <div className="sectionHeading">
          <h2>Upcoming Live Sessions</h2>

          <span>{sessionList.length} Sessions</span>
        </div>

        {sessionList.length === 0 ? (
          <div className="noSession">
            <h3>No Live Sessions</h3>

            <p>Create your first live session.</p>
          </div>
        ) : (
          sessionList.map((item) => (
            <div
              className="sessionCard"
              key={item.roomId}
            >
              <div className="cardHeader">
                <div>
                  <h3>{item.batch}</h3>

                  <p className="roomNumber">
                    Room ID :
                    <strong> {item.roomId}</strong>
                  </p>
                </div>

                <span className="statusBadge">
                  Scheduled
                </span>
              </div>

              <div className="infoGrid">
                <div className="infoCard">
                  <span>Date</span>

                  <h4>{item.date}</h4>
                </div>

                <div className="infoCard">
                  <span>Time</span>

                  <h4>{item.time}</h4>
                </div>

                <div className="infoCard">
                  <span>Batch</span>

                  <h4>{item.batch}</h4>
                </div>
              </div>

              <div className="actionBar">
                {item.notified ? (
                  <button
                    className="doneBtn"
                    disabled
                  >
                    ✓ Students Notified
                  </button>
                ) : (
                  <button
                    className="notifyBtn"
                    onClick={() =>
                      notifyBtnClick(item.roomId)
                    }
                  >
                    Notify Students
                  </button>
                )}

                <button
                  className="startBtn"
                  onClick={() =>
                    startClass(item.roomId)
                  }
                >
                  Start Session
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup */}

      {open && (
        <CreateSessionModal
          closeModal={closePopup}
          addSession={saveSession}
        />
      )}
    </div>
  );
}