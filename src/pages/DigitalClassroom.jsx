import { useEffect, useRef, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import ClassroomChat from "../components/ClassroomChat";
import "../styles/DigitalClassroom.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { saveBoard, getBoard } from "../services/whiteboardService";

export default function DigitalClassroom() {
  const location = useLocation();
  const navigate = useNavigate();

  const excalidrawAPI = useRef(null);
  const saveTimer = useRef(null);
  const attendanceMarked = useRef(false);

  const sessionId = location.state?.roomId;

  

  // ---------------- ATTENDANCE ----------------

  const markAttendance = useCallback( async () => {
    try {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (role !== "STUDENT") {
        return;
      }

      if (!token) {
        console.log("Token missing");
        return;
      }

      const data = {
        userId: userId,
        sessionId: sessionId,
        joinTime: new Date().toISOString().slice(0, 19),
        status: "Present",
      };

      console.log("Attendance Data", data);

      const response = await axios.post(
        "http://localhost:8080/api/attendance/mark",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data);
    } catch (error) {
      console.log("Attendance Mark Error", error.response?.data);
    }
  },[sessionId]);

  const updateLeaveAttendance = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role !== "STUDENT") {
        return;
      }

      console.log(
 "TOKEN:",
 localStorage.getItem("token")
);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.log("Missing token or user");
        return;
      }

      const data = {
        userId: userId,
        sessionId: sessionId,
        leaveTime: new Date().toISOString().slice(0, 19),
      };

      console.log("Leave Data", data);

      const response = await axios.put(
        "http://localhost:8080/api/attendance/update",

        data,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Leave Updated", response.data);
    } catch (error) {
      console.log("Leave Update Error", error.response);
    }
  };

  const leaveClass = async () => {
    const role = localStorage.getItem("role");

    if (role === "STUDENT") {
      await updateLeaveAttendance();
    }

    if (role === "TRAINER") {
      navigate("/trainer-dashboard");
    } else if (role === "STUDENT") {
      navigate("/student-dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  // ---------------- LOAD BOARD ----------------

  const loadBoard = useCallback( async () => {
    try {
      const res = await getBoard(sessionId);

      // No board exists
      if (!res.data) {
        if (excalidrawAPI.current) {
          excalidrawAPI.current.updateScene({
            elements: [],
          });
        }
        return;
      }

      const elements = JSON.parse(res.data.drawingData);

      if (excalidrawAPI.current) {
        excalidrawAPI.current.updateScene({
          elements,
        });
      }
    } catch (err) {
      console.log(err);

      if (excalidrawAPI.current) {
        excalidrawAPI.current.updateScene({
          elements: [],
        });
      }
    }
  },[sessionId])

   const handleChange = (elements) => {
    // Only trainer can save the whiteboard
    if (localStorage.getItem("role") !== "TRAINER") {
      return;
    }

    // Cancel previous save
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    // Save after 1 second
    saveTimer.current = setTimeout(async () => {
      try {
        await saveBoard({
          sessionId: sessionId,
          userId: localStorage.getItem("userId"),
          drawingData: JSON.stringify(elements),
          toolType: "PEN",
          color: "#000000",
          strokeWidth: 2,
        });

        console.log("Whiteboard Saved");
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };
  useEffect(() => {
    if (attendanceMarked.current) return;

    attendanceMarked.current = true;

    markAttendance();
  }, [markAttendance]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "STUDENT") {
      loadBoard();

      const interval = setInterval(() => {
        loadBoard();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [loadBoard]);

  

  useEffect(() => {
    if (excalidrawAPI.current) {
      loadBoard();
    }
  }, [loadBoard]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  if (!sessionId) {
    return (
      <div>
        <h2>No session selected</h2>
      </div>
    );
  }

  return (
    <div className="digitalContainer">
      <div className="whiteboardSection">
        <h2>Whiteboard Development Sandbox</h2>

        <div className="whiteboardBox">
          <Excalidraw
            theme="light"
            excalidrawAPI={(api) => {
              excalidrawAPI.current = api;

              // Load saved board after Excalidraw is ready
              loadBoard();
            }}
            onChange={handleChange}
          />
        </div>
        <div className="buttonRow">
          <button className="leaveBtn" onClick={leaveClass}>
            Leave Classroom
          </button>

          {localStorage.getItem("role") === "TRAINER" && (
            <button
              className="clearBtn"
              onClick={async () => {
                try {
                  // Clear trainer screen immediately
                  if (excalidrawAPI.current) {
                    excalidrawAPI.current.updateScene({
                      elements: [],
                    });
                  }

                  // Save empty board
                  await saveBoard({
                    sessionId,
                    userId: localStorage.getItem("userId"),
                    drawingData: JSON.stringify([]),
                    toolType: "PEN",
                    color: "#000000",
                    strokeWidth: 2,
                  });

                  console.log("Whiteboard Cleared");
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Clear Whiteboard
            </button>
          )}
        </div>
      </div>

      <div className="chatSection">
        <ClassroomChat sessionId={sessionId} />
      </div>
    </div>
  );
}
