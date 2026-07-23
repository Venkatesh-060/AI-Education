import { useState, useEffect, useRef, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import ClassroomChat from "../components/ClassroomChat";
import "../styles/DigitalClassroom.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { saveBoard, getBoard } from "../services/whiteboardService";
import {
  raiseHand,
  lowerHand,
  getStudentHand,
} from "../services/raiseHandService";
import RaiseHandPanel from "../components/RaiseHandPanel";
import {
  joinParticipant,
  disconnectParticipant,
} from "../services/participantService";
import socket from "../services/socketService";
import {
  createPeerConnection,
  getPeerConnection,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate,
  closePeerConnection,
} from "../services/webrtcService";
import ParticipantPanel from "../components/ParticipantPanel";

export default function DigitalClassroom() {
  const location = useLocation();
  const navigate = useNavigate();
  const excalidrawAPI = useRef(null);
  const saveTimer = useRef(null);
  const attendanceMarked = useRef(false);
  const sessionId = location.state?.roomId;
  const [handStatus, setHandStatus] = useState("");
  const [handId, setHandId] = useState("");
  const joinedRef = useRef(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [participantMic, setParticipantMic] = useState({});
  const [liveParticipants, setLiveParticipants] = useState([]);
  const [canUnmute, setCanUnmute] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [canShareScreen, setCanShareScreen] = useState(true);
  const [canSpeak, setCanSpeak] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  // ---------------- ATTENDANCE ----------------

  const markAttendance = useCallback(async () => {
    try {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (role !== "STUDENT") {
        return;
      }

      if (!token) {
        return;
      }

      const data = {
        userId: userId,
        sessionId: sessionId,
        joinTime: new Date().toISOString().slice(0, 19),
        status: "Present",
      };

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
  }, [sessionId]);

  const updateLeaveAttendance = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role !== "STUDENT") {
        return;
      }

      console.log("TOKEN:", localStorage.getItem("token"));

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

    try {
      // Disconnect Socket.io
      closePeerConnection();
      socket.disconnect();

      // Update participant status
      await disconnectParticipant({
        sessionId,
        userId: localStorage.getItem("userId"),
      });
    } catch (error) {
      console.log(error);
    }

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

  const loadBoard = useCallback(async () => {
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
  }, [sessionId]);

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
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };

  const handleRaiseHand = async () => {
    try {
      await raiseHand({
        sessionId,
        studentId: localStorage.getItem("userId"),
        studentName: localStorage.getItem("userName"),
      });

      setHandStatus("PENDING");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLowerHand = async () => {
    try {
      if (!handId) return;

      await lowerHand(handId);

      setHandId("");
      setHandStatus("");
    } catch (err) {
      console.error(err);
    }
  };

  const joinClassroom = useCallback(async () => {
    try {
      const role = localStorage.getItem("role");

      // Student enters waiting room first
      if (role === "STUDENT") {
        await requestJoin({
          sessionId,
          userId: localStorage.getItem("userId"),
          userName: localStorage.getItem("userName"),
        });

        alert("Waiting for trainer approval.");

        return;
      }

      // Trainer/Admin joins directly
      await joinParticipant({
        sessionId,
        userId: localStorage.getItem("userId"),
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("email"),
        role,
      });
    } catch (err) {
      console.log(err);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    if (joinedRef.current) return;

    joinedRef.current = true;

    joinClassroom();
  }, [joinClassroom, sessionId]);

  const toggleMic = () => {
    if (!localStream.current) return;

    if (!canSpeak) {
      alert("Trainer has revoked your speaking permission.");
      return;
    }

    if (!canUnmute && !micEnabled) {
      alert("Trainer has disabled microphone access.");
      return;
    }

    const audioTrack = localStream.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicEnabled(audioTrack.enabled);

    socket.emit("mic-status", {
      roomId: sessionId,
      enabled: audioTrack.enabled,
    });
  };

  const toggleCamera = async () => {
    try {
      if (!localStream.current) return;

      let videoTrack = localStream.current
        .getVideoTracks()
        .find((track) => track.kind === "video");

      // First time enable camera
      if (!videoTrack) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoTrack = stream.getVideoTracks()[0];

        localStream.current.addTrack(videoTrack);

        const pc = getPeerConnection();

        if (pc) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");

          if (sender) {
            sender.replaceTrack(videoTrack);
          } else {
            pc.addTrack(videoTrack, localStream.current);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        setCameraEnabled(true);

        socket.emit("camera-status", {
          roomId: sessionId,
          enabled: cameraEnabled,
        });

        return;
      }

      // Toggle existing track
      videoTrack.enabled = !videoTrack.enabled;

      setCameraEnabled(videoTrack.enabled);

      socket.emit("camera-status", {
        roomId: sessionId,
        enabled: videoTrack.enabled,
      });
    } catch (err) {
      console.log(err);
    }
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

  useEffect(() => {
    if (localStorage.getItem("role") !== "STUDENT") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await getStudentHand(
          sessionId,
          localStorage.getItem("userId"),
        );

        if (res.data) {
          setHandStatus(res.data.status);
          setHandId(res.data.id);
        } else {
          setHandStatus("");
          setHandId("");
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    const onConnect = () => {
      console.log("Socket Connected");
      console.log("Socket ID :", socket.id);

      socket.emit("join-room", {
        roomId: sessionId,
        userId: localStorage.getItem("userId"),
        name: localStorage.getItem("userName"),
        role: localStorage.getItem("role"),
      });

      console.log("Joined Room :", sessionId);
    };

    // Register connect listener
    socket.on("connect", onConnect);

    // Connect only once
    if (!socket.connected) {
      socket.connect();
    } else {
      onConnect();
    }

    // Trainer creates offer when student joins
    socket.on("user-joined", async () => {
      console.log("User Joined");

      if (localStorage.getItem("role") !== "TRAINER") return;

      let pc = getPeerConnection();

      if (!pc) {
        pc = createPeerConnection();

        // Add audio track only once
        if (localStream.current) {
          localStream.current.getTracks().forEach((track) => {
            const exists = pc
              .getSenders()
              .find((sender) => sender.track === track);

            if (!exists) {
              pc.addTrack(track, localStream.current);
            }
          });
        }

        pc.ontrack = (event) => {
          console.log("Remote Stream Received");

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play().catch(() => {});
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("signal", {
              roomId: sessionId,
              type: "ice-candidate",
              candidate: event.candidate,
            });
          }
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection :", pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE :", pc.iceConnectionState);
        };
      }

      const offer = await createOffer();

      socket.emit("signal", {
        roomId: sessionId,
        type: "offer",
        offer,
      });

      console.log("Offer Sent");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("user-joined");
    };
  }, [sessionId]);

  useEffect(() => {
    const initializeClassroom = async () => {
      try {
        if (!localStream.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });

          localStream.current = stream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          console.log("Media Ready");
        }

        if (!socket.connected) {
          socket.connect();
        }
      } catch (err) {
        console.log(err);
      }
    };

    initializeClassroom();
  }, []);

  useEffect(() => {
    socket.on("signal", async (data) => {
      if (data.type === "offer") {
        console.log("Offer Received");

        let pc = getPeerConnection();

        if (!pc) {
          pc = createPeerConnection();

          if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
              const exists = pc
                .getSenders()
                .find((sender) => sender.track === track);

              if (!exists) {
                pc.addTrack(track, localStream.current);
              }
            });
          }

          pc.ontrack = (event) => {
            console.log("Remote Stream");

            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("signal", {
                roomId: sessionId,
                type: "ice-candidate",
                candidate: event.candidate,
              });
            }
          };

          pc.onconnectionstatechange = () => {
            console.log("Connection:", pc.connectionState);
          };

          pc.oniceconnectionstatechange = () => {
            console.log("ICE:", pc.iceConnectionState);
          };
        }

        await setRemoteDescription(data.offer);

        console.log("Remote Description Set");

        const answer = await createAnswer();

        socket.emit("signal", {
          roomId: sessionId,
          type: "answer",
          answer,
        });

        console.log("Answer Sent");
      } else if (data.type === "answer") {
        console.log("Answer Received");

        await setRemoteDescription(data.answer);
        console.log("Trainer Remote Description Set");
      } else if (data.type === "ice-candidate") {
        if (data.candidate) {
          await addIceCandidate(data.candidate);
        }
      }
    });

    return () => {
      socket.off("signal");
    };
  }, [sessionId]);

  useEffect(() => {
    socket.on("mic-status-update", (data) => {
      setParticipantMic((prev) => ({
        ...prev,

        [data.socketId]: data.enabled,
      }));
    });

    return () => {
      socket.off("mic-status-update");
    };
  }, []);

  useEffect(() => {
    socket.on("force-mute", () => {
      const track = localStream.current?.getAudioTracks()[0];

      if (!track) return;

      track.enabled = false;

      setMicEnabled(false);

      setCanUnmute(false);

      socket.emit("mic-status", {
        roomId: sessionId,
        enabled: false,
      });
    });

    return () => {
      socket.off("force-mute");
    };
  }, []);

  useEffect(() => {
    socket.on("allow-unmute", () => {
      setCanUnmute(true);
    });

    return () => {
      socket.off("allow-unmute");
    };
  }, []);

  useEffect(() => {
    socket.on("participants-updated", (list) => {
      setLiveParticipants(list);
      setParticipantCount(list.length);
    });

    return () => {
      socket.off("participants-updated");
    };
  }, []);

  useEffect(() => {
    socket.on("participant-count", (count) => {
      setParticipantCount(count);
    });

    return () => {
      socket.off("participant-count");
    };
  }, []);

  useEffect(() => {
    socket.on("enable-camera-request", () => {
      const ok = window.confirm("Trainer requested you to enable your camera.");

      if (ok) {
        toggleCamera();
      }
    });

    return () => {
      socket.off("enable-camera-request");
    };
  }, []);
  useEffect(() => {
    socket.on("user-joined", (socketId) => {
      console.log("Participant Joined :", socketId);
    });

    return () => {
      socket.off("user-joined");
    };
  }, []);

  useEffect(() => {
    socket.on("participant-left", (data) => {
      console.log(data.name + " left the classroom");
    });

    return () => {
      socket.off("participant-left");
    };
  }, []);

  useEffect(() => {
    socket.on("screen-permission", (enabled) => {
      setCanShareScreen(enabled);
    });

    return () => {
      socket.off("screen-permission");
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
      {/* ================= LEFT SECTION ================= */}

      <div className="mainSection">
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2>🎓 Live Classroom</h2>

          <h3>👥 Participants : {participantCount}</h3>
        </div>

        {/* Whiteboard */}

        <div className="whiteboardBox">
          <Excalidraw
            theme="light"
            excalidrawAPI={(api) => {
              excalidrawAPI.current = api;
              loadBoard();
            }}
            onChange={handleChange}
          />
        </div>

        {/* Bottom Controls */}

        <div className="bottomPanel">
          {/* Videos */}

          <div className="videoContainer">

  {/* Local User */}

  <div className="videoCard">
    {cameraEnabled ? (
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="videoBox"
      />
    ) : (
      <div className="avatarBox">
        <div className="avatarCircle">
          {localStorage.getItem("userName")
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <h3>You</h3>

        <p>{localStorage.getItem("userName")}</p>
      </div>
    )}
  </div>

  {/* Other Participants */}

  {liveParticipants
    .filter(
      (participant) =>
        participant.userId !== localStorage.getItem("userId")
    )
    .map((participant) => (
      <div
        className="videoCard"
        key={participant.socketId}
      >
        {participant.camera ? (
          <video
            autoPlay
            playsInline
            className="videoBox"
          />
        ) : (
          <div className="avatarBox">
            <div className="avatarCircle">
              {participant.name?.charAt(0).toUpperCase()}
            </div>

            <h3>{participant.name}</h3>

            <p>
              {participant.mic ? "🎤 Mic On" : "🔇 Mic Off"}
            </p>
          </div>
        )}
      </div>
    ))}
</div>

          {/* Buttons */}

          <div className="controls">
            <button onClick={toggleMic} disabled={!canSpeak}>
              {micEnabled ? "🎤 Mute Mic" : "🎤 Unmute Mic"}
            </button>

            <button onClick={toggleCamera}>
              {cameraEnabled ? "📷 Camera Off" : "📷 Camera On"}
            </button>

            {localStorage.getItem("role") === "TRAINER" && (
              <>
                <button onClick={() => socket.emit("mute-all", sessionId)}>
                  🔇 Mute All
                </button>

                <button onClick={() => socket.emit("allow-unmute", sessionId)}>
                  🎤 Allow Unmute
                </button>

                <button
                  className="clearBtn"
                  onClick={async () => {
                    if (excalidrawAPI.current) {
                      excalidrawAPI.current.updateScene({
                        elements: [],
                      });
                    }

                    await saveBoard({
                      sessionId,
                      userId: localStorage.getItem("userId"),
                      drawingData: JSON.stringify([]),
                      toolType: "PEN",
                      color: "#000000",
                      strokeWidth: 2,
                    });
                  }}
                >
                  🧹 Clear Board
                </button>
              </>
            )}

            {localStorage.getItem("role") === "STUDENT" &&
              handStatus === "" && (
                <button className="raiseBtn" onClick={handleRaiseHand}>
                  ✋ Raise Hand
                </button>
              )}

            {localStorage.getItem("role") === "STUDENT" &&
              handStatus === "PENDING" && (
                <button className="raiseBtn" onClick={handleLowerHand}>
                  Lower Hand
                </button>
              )}

            <button className="leaveBtn" onClick={leaveClass}>
              🚪 Leave
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}

      <div className="rightSidebar">
        {/* Sidebar Tabs */}

        <div className="sidebarTabs">
          <button
            className={activeTab === "chat" ? "activeTab" : ""}
            onClick={() => setActiveTab("chat")}
          >
            💬 Chat
          </button>

          {localStorage.getItem("role") === "TRAINER" && (
            <button
              className={activeTab === "participants" ? "activeTab" : ""}
              onClick={() => setActiveTab("participants")}
            >
              👥 Participants
            </button>
          )}

          {localStorage.getItem("role") === "TRAINER" && (
            <button
              className={activeTab === "hands" ? "activeTab" : ""}
              onClick={() => setActiveTab("hands")}
            >
              ✋ Raised Hands
            </button>
          )}
        </div>

        {/* Sidebar Content */}

        <div className="sidebarContent">
          {activeTab === "chat" && <ClassroomChat sessionId={sessionId} />}

          {activeTab === "participants" &&
            localStorage.getItem("role") === "TRAINER" && (
              <ParticipantPanel
                sessionId={sessionId}
                participantMic={participantMic}
                liveParticipants={liveParticipants}
              />
            )}

          {activeTab === "hands" &&
            localStorage.getItem("role") === "TRAINER" && (
              <RaiseHandPanel sessionId={sessionId} />
            )}

          {activeTab === "waiting" && (
            <WaitingRoomPanel sessionId={sessionId} />
          )}
        </div>
      </div>
    </div>
  );
}
