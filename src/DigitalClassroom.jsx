import React, { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import ClassroomChat from "./ClassroomChat";
import "./DigitalClassroom.css";

export default function DigitalClassroom() {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("whiteboard");

    if (savedData) {
      setInitialData({
        elements: JSON.parse(savedData),
      });
    } else {
      setInitialData({
        elements: [],
      });
    }
  }, []);

  const handleChange = (elements) => {
    localStorage.setItem("whiteboard", JSON.stringify(elements));
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="digitalContainer">
      <div className="whiteboardSection">
        <h2>Whiteboard Development Sandbox</h2>

        <div className="whiteboardBox">
          <Excalidraw
            theme="light"
            initialData={initialData}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="chatSection">
        <ClassroomChat />
      </div>
    </div>
  );
}