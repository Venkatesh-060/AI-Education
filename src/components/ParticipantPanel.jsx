import { useEffect, useState } from "react";
import socket from "../services/socketService";
import {
  getParticipants,
  removeParticipant,
  allowRejoin,
} from "../services/participantService";
import "../styles/ParticipantPanel.css";

export default function ParticipantPanel({
  sessionId,
  participantMic,
  liveParticipants,
}) {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");

  const loadParticipants = async () => {
    try {
      const response = await getParticipants(sessionId);
      setParticipants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadParticipants();

    const interval = setInterval(loadParticipants, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Merge DB participant with Live Socket participant
  const mergedParticipants = participants.map((dbParticipant) => {
    const live = liveParticipants?.find(
      (p) => p.userId === dbParticipant.userId,
    );

    return {
      ...dbParticipant,
      socketId: live?.socketId || null,

      // Live Status
      online: !!live,

      // Live Mic Status
      mic: live?.mic ?? false,

      // Live Camera Status
      camera: live?.camera ?? false,
    };
  });

  // Search
  const filteredParticipants = mergedParticipants.filter((participant) => {
    const keyword = search.toLowerCase();

    return (
      (participant.name || "").toLowerCase().includes(keyword) ||
      (participant.email || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="participantPanel">
      <div className="participantHeader">
        <h3>👥 Participants</h3>
        <span>{filteredParticipants.length} Online</span>
      </div>

      <input
        className="participantSearch"
        placeholder="Search participant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredParticipants.length === 0 ? (
        <p className="emptyText">No Participants</p>
      ) : (
        filteredParticipants.map((participant) => (
          <div className="participantCard" key={participant.id}>
            {/* Header */}

            <div className="participantTop">
              <div className="participantInfo">
                <div className="avatar">
                  {participant.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h4>{participant.name}</h4>

                  <small>{participant.email}</small>

                  <div className="liveStatus">
                    <span
                      className={
                        participant.online ? "onlineDot" : "offlineDot"
                      }
                    />

                    {participant.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              <span
                className={`status ${(participant.status || "").toLowerCase()}`}
              >
                {participant.status}
              </span>
            </div>

            {/* Device Status */}

            <div className="deviceStatus">
              <div>{participant.mic ? "🎤 Mic On" : "🔇 Mic Off"}</div>

              <div>{participant.camera ? "📷 Camera On" : "📷 Camera Off"}</div>
            </div>

            {/* Controls */}

            {participant.status === "ACTIVE" && (
              <details className="controlPanel">
                <summary>⚙ Controls</summary>

                <div className="actionGrid">
                  <button
                    className="primaryBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("mute-user", {
                        socketId: participant.socketId,
                      })
                    }
                  >
                    🔇 Mute
                  </button>

                  <button
                    className="primaryBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("request-camera", {
                        socketId: participant.socketId,
                      })
                    }
                  >
                    📷 Camera
                  </button>

                  <button
                    className="warningBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-speaking-permission", {
                        socketId: participant.socketId,
                        enabled: false,
                      })
                    }
                  >
                    🚫 Mic
                  </button>

                  <button
                    className="successBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-speaking-permission", {
                        socketId: participant.socketId,
                        enabled: true,
                      })
                    }
                  >
                    🎤 Allow
                  </button>

                  <button
                    className="warningBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-chat-permission", {
                        socketId: participant.socketId,
                        enabled: false,
                      })
                    }
                  >
                    🚫 Chat
                  </button>

                  <button
                    className="successBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-chat-permission", {
                        socketId: participant.socketId,
                        enabled: true,
                      })
                    }
                  >
                    💬 Chat
                  </button>

                  <button
                    className="warningBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-screen-share-permission", {
                        socketId: participant.socketId,
                        enabled: false,
                      })
                    }
                  >
                    🚫 Share
                  </button>

                  <button
                    className="successBtn"
                    disabled={!participant.socketId}
                    onClick={() =>
                      socket.emit("set-screen-share-permission", {
                        socketId: participant.socketId,
                        enabled: true,
                      })
                    }
                  >
                    🖥 Share
                  </button>

                  <button
                    className="removeBtn"
                    onClick={async () => {
                      await removeParticipant(participant.id);
                      loadParticipants();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </details>
            )}

            {participant.status === "REMOVED" && (
              <button
                className="allowBtn"
                onClick={async () => {
                  await allowRejoin(participant.id);
                  loadParticipants();
                }}
              >
                Allow Rejoin
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
