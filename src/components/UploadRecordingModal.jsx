import { useState } from "react";
import "../styles/UploadRecordingModal.css";

export default function UploadRecordingModal(props) {

  const [sessionName, setSessionName] = useState("");
  const [recordTitle, setRecordTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [duration, setDuration] = useState("");

  const sessionList = [
    "React Beginners",
    "Java Full Stack",
    "Python Batch",
    "MERN Stack",
    "AI & Machine Learning",
    "Data Science",
  ];

  const uploadRecording = () => {

    if (sessionName === "") {
      alert("Please select session.");
      return;
    }

    if (recordTitle.trim() === "") {
      alert("Please enter recording title.");
      return;
    }

    if (!videoFile) {
      alert("Please choose a video.");
      return;
    }

    if (duration === "") {
      alert("Please enter duration.");
      return;
    }

    const recording = {
      recordingId: "REC" + Math.floor(Math.random() * 1000000),
      session: sessionName,
      title: recordTitle,
      duration: duration,
      uploadDate: new Date().toLocaleDateString(),

      // Save only these
      videoName: videoFile.name,
      videoUrl: URL.createObjectURL(videoFile),
    };

    props.addRecording(recording);

    alert("Recording Uploaded Successfully.");

    props.closeModal();
  };

  return (
    <div className="uploadPopup">

      <div className="uploadBox">

        <div className="uploadHeader">

          <h2>Upload Recording</h2>

          <button
            className="closeUploadBtn"
            onClick={props.closeModal}
          >
            ✕
          </button>

        </div>

        <div className="inputGroup">

          <label>Session</label>

          <select
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          >
            <option value="">Select Session</option>

            {sessionList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        <div className="inputGroup">

          <label>Recording Title</label>

          <input
            type="text"
            placeholder="Enter title"
            value={recordTitle}
            onChange={(e) => setRecordTitle(e.target.value)}
          />

        </div>

        <div className="inputGroup">

          <label>Upload Video</label>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

        </div>

        <div className="inputGroup">

          <label>Duration (Minutes)</label>

          <input
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

        </div>

        <div className="buttonBox">

          <button
            className="cancelBtn"
            onClick={props.closeModal}
          >
            Cancel
          </button>

          <button
            className="uploadBtn"
            onClick={uploadRecording}
          >
            Upload Recording
          </button>

        </div>

      </div>

    </div>
  );
}