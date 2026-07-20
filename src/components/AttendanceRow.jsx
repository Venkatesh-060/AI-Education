export default function AttendanceRow({ attendance, viewDetails }) {
  return (
    <tr>
      <td>{attendance.studentName}</td>

      <td>{attendance.sessionName}</td>

      <td>{attendance.batchName}</td>

      <td>{attendance.joinTime}</td>

      <td>{attendance.leaveTime || "-"}</td>

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
          View
        </button>
      </td>
    </tr>
  );
}
