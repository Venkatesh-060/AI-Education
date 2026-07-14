import React, { useEffect, useState } from "react";
import AttendanceStatsCard from "../components/AttendanceStatsCard";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceDetailsModal from "../components/AttendanceDetailsModal";
import { getAllAttendance } from "../services/attendanceService";
import "../styles/Attendance.css";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await getAllAttendance();

      console.log(response.data);

      setAttendance(response.data);
    } catch (err) {
      console.log(err);

      setError("Unable to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const filtered = attendance.filter((item) =>
    (item.userId || "").toLowerCase().includes(search.toLowerCase()),
  );

  const present = attendance.filter((item) => item.status === "Present").length;

  const absent = attendance.filter((item) => item.status === "Absent").length;

  const percentage =
    attendance.length === 0
      ? 0
      : Math.round((present / attendance.length) * 100);

  return (
    <div className="attendancePage">
      <h2>Attendance Dashboard</h2>

      <AttendanceStatsCard
        total={attendance.length}
        present={present}
        absent={absent}
        percentage={percentage}
      />

      <AttendanceFilters search={search} setSearch={setSearch} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <AttendanceTable attendance={filtered} viewDetails={setSelected} />
      )}

      {selected && (
        <AttendanceDetailsModal
          attendance={selected}
          close={() => setSelected(null)}
        />
      )}
    </div>
  );
}
