import React, { useState } from "react";
import "../styles/CreateSessionModal.css";

export default function CreateSessionModal(props) {
  const [batchName, setBatchName] = useState("");
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const batchList = [
    "React Beginners",
    "Java Full Stack",
    "Python Batch",
    "MERN Stack",
    "AI & Machine Learning",
    "Data Science",
  ];

  const createSession = () => {
    if (batchName === "") {
      alert("Please select batch");
      return;
    }

    if (classDate === "") {
      alert("Please select date");
      return;
    }

    if (classTime === "") {
      alert("Please select start time");
      return;
    }

    if (endTime === "") {
      alert("Please select end time");
      return;
    }

    const randomRoomId = Math.floor(100000 + Math.random() * 900000);

    const sessionData = {
      roomId: randomRoomId,
      batch: batchName,
      date: classDate,
      time: classTime,
      endTime: endTime,
      notified: false,
    };

    props.addSession(sessionData);

    alert("Live Session Created Successfully");

    props.closeModal();
  };

  return (
    <div className="popupBg">
      <div className="popupBox">
        <div className="popupHeader">
          <h2>Create Live Session</h2>

          <button className="closeBtn" onClick={props.closeModal}>
            ✕
          </button>
        </div>

        <div className="inputBox">
          <label>Select Batch</label>

          <select
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          >
            <option value="">Choose Batch</option>

            {batchList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="inputBox">
          <label>Select Date</label>

          <input
            type="date"
            value={classDate}
            onChange={(e) => setClassDate(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <label>Start Time</label>

          <input
            type="time"
            value={classTime}
            onChange={(e) => setClassTime(e.target.value)}
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

          <button className="createBtn" onClick={createSession}>
            Generate Meeting
          </button>
        </div>
      </div>
    </div>
  );
}