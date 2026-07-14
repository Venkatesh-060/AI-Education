import React, { useState, useEffect } from "react";
import "../styles/AddSessionModal.css";

export default function AddSessionModal(props) {
  const [sessionName, setSessionName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (props.editData) {
      setSessionName(props.editData.sessionName || "");
      setTrainerId(props.editData.trainerId || "");
      setBatchName(props.editData.batchName || "");
      setSessionDate(props.editData.sessionDate || "");
      setStartTime(props.editData.startTime || "");
      setEndTime(props.editData.endTime || "");
    }
  }, [props.editData]);

  const saveSession = () => {
    if (sessionName.trim() === "") {
      alert("Please enter session name");
      return;
    }

    if (trainerId.trim() === "") {
      alert("Please enter trainer id");
      return;
    }

    if (batchName.trim() === "") {
      alert("Please enter batch name");
      return;
    }

    if (sessionDate === "") {
      alert("Please select date");
      return;
    }

    if (startTime === "") {
      alert("Please select start time");
      return;
    }

    const sessionData = {
      sessionName: sessionName,

      trainerId: trainerId,

      batchName: batchName,

      sessionDate: sessionDate,

      startTime: startTime,

      endTime: endTime,
    };

    if (props.editData) {
      props.updateSession(sessionData);

      alert("Session Updated Successfully");
    } else {
      props.addSession(sessionData);

      alert("Session Added Successfully");
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
          <label>Trainer ID</label>

          <input
            type="text"
            placeholder="Enter Trainer ID"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Batch Name</label>

          <input
            type="text"
            placeholder="Enter Batch Name"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Session Date</label>

          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Start Time</label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>End Time</label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
