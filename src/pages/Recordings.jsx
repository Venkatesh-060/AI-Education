import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadRecordingModal from "../components/UploadRecordingModal";
import "../styles/Recordings.css";

export default function Recordings() {
  const navigate = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);
const [recordList, setRecordList] = useState(() => {
  return JSON.parse(localStorage.getItem("recordings")) || [];
});

  const openModal = () => {
    setOpenPopup(true);
  };

  const closeModal = () => {
    setOpenPopup(false);
  };

 const addRecording = (recordData) => {

  const updatedList = [...recordList, recordData];

  setRecordList(updatedList);

  localStorage.setItem(
    "recordings",
    JSON.stringify(updatedList)
  );
};

  const openSessionPage = () => {
    navigate("/session-recordings");
  };

  const viewRecording = (videoUrl) => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    } else {
      alert("Video not available.");
    }
  };

  return (
    <div className="recordDashboard">

      {/* Header */}

      <div className="topSection">

        <div className="pageTitle">
          <h1>Recording Dashboard</h1>
          <p>Manage all uploaded classroom recordings.</p>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            className="downloadBtn"
            onClick={openSessionPage}
          >
            View Recordings
          </button>

          <button
            className="uploadRecordBtn"
            onClick={openModal}
          >
            + Upload Recording
          </button>
        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="dashboardCards">

        <div className="dashCard">
          <h2>{recordList.length}</h2>
          <p>Total Recordings</p>
        </div>

        <div className="dashCard">
          <h2>{recordList.length}</h2>
          <p>Uploaded Videos</p>
        </div>

        <div className="dashCard">
          <h2>
            {recordList.reduce(
              (total, item) => total + Number(item.duration),
              0
            )}
          </h2>
          <p>Total Minutes</p>
        </div>

      </div>

      {/* Recording List */}

      <div className="recordSection">

        <div className="sectionTop">
          <h2>Uploaded Recordings</h2>
          <span>{recordList.length} Files</span>
        </div>

        {recordList.length === 0 ? (
          <div className="emptyBox">
            <h3>No Recordings Found</h3>
            <p>Upload your first classroom recording.</p>
          </div>
        ) : (
          recordList.map((item) => (
            <div className="recordCard" key={item.recordingId}>

              <div className="recordHeader">

                <div>
                  <h3>{item.title}</h3>

                  <p>
                    <strong>Recording ID :</strong> {item.recordingId}
                  </p>
                </div>

                <span className="uploadStatus">
                  Uploaded
                </span>

              </div>

              <div className="recordInfo">

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

              <div className="recordBtns">

                <button
                  className="viewBtn"
                  onClick={() => viewRecording(item.videoUrl)}
                >
                  View Recording
                </button>

                <a href={item.videoUrl} download={item.videoName}>
                  <button className="downloadBtn">
                    Download
                  </button>
                </a>

              </div>

            </div>
          ))
        )}

      </div>

      {openPopup && (
        <UploadRecordingModal
          closeModal={closeModal}
          addRecording={addRecording}
        />
      )}

    </div>
  );
}