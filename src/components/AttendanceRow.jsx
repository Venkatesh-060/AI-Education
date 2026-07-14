import React from "react";

export default function AttendanceRow({ attendance, viewDetails }) {
  return (
    <tr>
      <td>{attendance.userId}</td>

      <td>{attendance.sessionId}</td>

      <td>{attendance.joinTime}</td>

      <td>{attendance.leaveTime}</td>

      <td>{attendance.duration} mins</td>

      <td>
        <span className={attendance.status.toLowerCase()}>
          {attendance.status}
        </span>
      </td>

      <td>
        <button 
        className="viewDetailsBtn"
        onClick={() => viewDetails(attendance)}
        >
          View Details</button>
      </td>
    </tr>
  );
}
