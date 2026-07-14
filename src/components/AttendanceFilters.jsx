import React from "react";

export default function AttendanceFilters(props) {
  return (
    <div className="filterBox">
      <input
        type="text"
        placeholder="Search Student"
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
      />
    </div>
  );
}
