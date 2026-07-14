import React from "react";

export default function AttendanceCard({ title, value }) {
  return (
    <div className="attendanceCard">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}