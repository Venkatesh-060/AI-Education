import React, { useState } from "react";
import UploadRecordingModal from "../components/UploadRecordingModal";
import "../styles/Recordings.css";

export default function Recordings() {
  const [openPopup, setOpenPopup] = useState(false);

  const [recordList, setRecordList] = useState([]);

  const openModal = () => {
    setOpenPopup(true);
  };

  const closeModal = () => {
    setOpenPopup(false);
  };

  const addRecording = (recordData) => {
    setRecordList([...recordList, recordData]);
  };

  const viewRecording = (video) => {
    window.open(video, "_blank");
  };

  return (
    <div className="recordDashboard">
      <div className="topSection">
        <div>
          <h1>Recording Dashboard</h1>
          <p>Manage all uploaded classroom recordings.</p>
        </div>

        <button className="uploadRecordBtn" onClick={openModal}>
          + Upload Recording
        </button>
      </div>

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
              0,
            )}
          </h2>

          <p>Total Minutes</p>
        </div>
      </div>

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
                    Recording ID :<strong> {item.recordingId}</strong>
                  </p>
                </div>

                <span className="uploadStatus">Uploaded</span>
              </div>

              <div className="recordInfo">
                <div className="infoCard">
                  <span>Session</span>

                  <h4>{item.session}</h4>
                </div>

                <div className="infoCard">
                  <span>Duration</span>

                  <h4>{item.duration} Min</h4>
                </div>

                <div className="infoCard">
                  <span>Video</span>

                  <h4>{item.video.name}</h4>
                </div>
              </div>

              <div className="recordBtns">
                <button
                  className="viewBtn"
                  onClick={() => viewRecording(item.videoUrl)}
                >
                  View Recording
                </button>

                <a href={item.videoUrl} download={item.video.name}>
                  <button className="downloadBtn">Download</button>
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
