import React, { useEffect, useState } from "react";
import "../styles/SessionRecordings.css";

export default function SessionRecordings() {
  const [recordList, setRecordList] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recordings")) || [];
    setRecordList(data);
  }, []);

  const playRecording = (item) => {
  if (!item.videoUrl) {
    alert("Video not available");
    return;
  }

  window.open(item.videoUrl, "_blank");
};

  const downloadRecording = (item) => {
  if (!item.videoUrl) {
    alert("Video not found");
    return;
  }

  const link = document.createElement("a");
  link.href = item.videoUrl;
  link.download = item.videoName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};;

  const deleteRecording = (id) => {
    const newList = recordList.filter((item) => {
      return item.recordingId !== id;
    });

    setRecordList(newList);

    localStorage.setItem("recordings", JSON.stringify(newList));

    alert("Recording Deleted Successfully");
  };

  return (
    <div className="recordPage">
      <div className="recordTop">
        <div>
          <h1>Session Recordings</h1>
          <p>Manage uploaded recordings</p>
        </div>
      </div>

      <div className="recordCards">
        <div className="topCard">
          <h2>{recordList.length}</h2>
          <p>Total Recordings</p>
        </div>

        <div className="topCard">
          <h2>{recordList.length}</h2>
          <p>Videos</p>
        </div>

        <div className="topCard">
          <h2>
            {recordList.reduce((total, item) => {
              return total + Number(item.duration);
            }, 0)}
          </h2>

          <p>Total Minutes</p>
        </div>
      </div>

      <div className="recordSection">
        <div className="sectionHeading">
          <h2>Uploaded Recordings</h2>

          <span>{recordList.length} Files</span>
        </div>

        {recordList.length === 0 ? (
          <div className="emptyBox">
            <h3>No Recordings</h3>
            <p>Upload recordings first.</p>
          </div>
        ) : (
          recordList.map((item) => (
            <div className="recordCard" key={item.recordingId}>
              <div className="cardHeader">
                <div>
                  <h3>{item.title}</h3>

                  <p>
                    <strong>ID :</strong> {item.recordingId}
                  </p>
                </div>

                <span className="statusBadge">Uploaded</span>
              </div>

              <div className="infoGrid">
                <div className="infoCard">
                  <span>Session</span>
                  <h4>{item.session}</h4>
                </div>

                <div className="infoCard">
                  <span>Duration</span>
                  <h4>{item.duration} Minutes</h4>
                </div>

                <div className="infoCard">
                  <span>Video</span>
                  <h4>{item.videoName}</h4>
                </div>
              </div>

              <div className="buttonSection">
                <button
                  className="playBtn"
                  onClick={() => playRecording(item)}
                >
                  ▶ Play
                </button>

                <button
                    className="downloadBtn"
                    onClick={() => downloadRecording(item)}
                >
                    ⬇ Download
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => deleteRecording(item.recordingId)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
