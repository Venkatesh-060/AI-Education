import React from "react";
import "../styles/AttendanceDetailsModal.css";

export default function AttendanceDetailsModal({ attendance, close }) {
  return (
    <div className="attendanceModalOverlay">
      <div className="attendanceModalBox">
        <div className="attendanceModalHeader">
          <h2>Attendance Details</h2>

          <button className="modalClose" onClick={close}>
            ✕
          </button>
        </div>

        <div className="detailsContainer">
          <div className="detailItem">
            <span>Student ID</span>
            <p>{attendance.userId}</p>
          </div>

          <div className="detailItem">
            <span>Session ID</span>
            <p>{attendance.sessionId}</p>
          </div>

          <div className="detailItem">
            <span>Join Time</span>
            <p>{attendance.joinTime}</p>
          </div>

          <div className="detailItem">
            <span>Leave Time</span>
            <p>
              {attendance.leaveTime ? attendance.leaveTime : "Not Left Yet"}
            </p>
          </div>

          <div className="detailItem">
            <span>Duration</span>
            <p>{attendance.duration} Minutes</p>
          </div>

          <div className="detailItem">
            <span>Status</span>

            <p>
              <span
                className={
                  attendance.status === "Present"
                    ? "presentBadge"
                    : "absentBadge"
                }
              >
                {attendance.status}
              </span>
            </p>
          </div>
        </div>

        <div className="modalFooter">
          <button className="closeButton" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
