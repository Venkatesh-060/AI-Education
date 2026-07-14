import React from "react";
import AttendanceCard from "./AttendanceCard";

export default function AttendanceStatsCard({
  total,
  present,
  absent,
  percentage,
}) {
  return (
    <div className="stats">

      <AttendanceCard
        title="Total Students"
        value={total}
      />

      <AttendanceCard
        title="Present"
        value={present}
      />

      <AttendanceCard
        title="Absent"
        value={absent}
      />

      <AttendanceCard
        title="Attendance %"
        value={`${percentage}%`}
      />

    </div>
  );
}