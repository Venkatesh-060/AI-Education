import React, { useState, useEffect } from "react";
import "../styles/AddSessionModal.css";

export default function AddSessionModal(props) {
  const [sessionName, setSessionName] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Upcoming");

  useEffect(() => {
    if (props.editData) {
      setSessionName(props.editData.sessionName);
      setTrainerName(props.editData.trainerName);
      setDate(props.editData.date);
      setTime(props.editData.time);
      setDuration(props.editData.duration);
      setDescription(props.editData.description);
      setStatus(props.editData.status);
    }
  }, [props.editData]);

  const saveSession = () => {
    if (sessionName === "") {
      alert("Please enter session name.");
      return;
    }

    if (trainerName === "") {
      alert("Please enter trainer name.");
      return;
    }

    if (date === "") {
      alert("Please select date.");
      return;
    }

    if (time === "") {
      alert("Please select time.");
      return;
    }

    if (duration === "") {
      alert("Please enter duration.");
      return;
    }

    if (description === "") {
      alert("Please enter description.");
      return;
    }

    const sessionData = {
      sessionId:
        props.editData?.sessionId ||
        "SES" + Math.floor(100000 + Math.random() * 900000),

      sessionName,
      trainerName,
      date,
      time,
      duration,
      description,
      status,
    };

    if (props.editData) {
      props.updateSession(sessionData);
      alert("Session Updated Successfully.");
    } else {
      props.addSession(sessionData);
      alert("Session Added Successfully.");
    }

    props.closeModal();
  };

  return (
    <div className="popupBg">
      <div className="popupBox">
        <div className="popupHeader">
          <h2>{props.editData ? "Edit Session" : "Add New Session"}</h2>

          <button className="closeBtn" onClick={props.closeModal}>
            ✕
          </button>
        </div>

        <div className="inputBox">
          <label>Session Name</label>

          <input
            type="text"
            placeholder="Enter Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Trainer Name</label>

          <input
            type="text"
            placeholder="Enter Trainer Name"
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Time</label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Duration (Minutes)</label>

          <input
            type="number"
            placeholder="Enter Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Status</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Upcoming</option>
            <option>Live</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="inputBox">
          <label>Description</label>

          <textarea
            rows="4"
            placeholder="Enter Session Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="btnBox">
          <button className="cancelBtn" onClick={props.closeModal}>
            Cancel
          </button>

          <button className="createBtn" onClick={saveSession}>
            {props.editData ? "Update Session" : "Add Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
