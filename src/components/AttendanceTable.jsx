import AttendanceRow from "./AttendanceRow";
// import { getAttendanceReport } from "../services/attendanceService";
export default function AttendanceTable({ attendance, viewDetails }) {
  if (attendance.length === 0) {
    return <h3>No attendance records found</h3>;
  }

  return (
    <table>
      <thead>
  <tr>
    <th>Student</th>
    <th>Session</th>
    <th>Batch</th>
    <th>Join Time</th>
    <th>Leave Time</th>
    <th>Duration</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
</thead>

      <tbody>
        {attendance.map((item, index) => (
          <AttendanceRow
            key={index}
            attendance={item}
            viewDetails={viewDetails}
          />
        ))}
      </tbody>
    </table>
  );
}
