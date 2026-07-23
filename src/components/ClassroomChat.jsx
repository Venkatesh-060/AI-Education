import { useEffect, useRef, useState } from "react";
import "../styles/ClassroomChat.css";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../services/chatService";
import socket from "../services/socketService";

export default function ClassroomChat({ sessionId }) {
  const [chat, setChat] = useState([]);
  const [typingBox, setTypingBox] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [canChat, setCanChat] = useState(true);

  const role = localStorage.getItem("role");
  const senderId = localStorage.getItem("userId");
  const senderName = localStorage.getItem("userName");

  const messageEndRef = useRef(null);

  const loadMessages = async () => {
    try {
      const response = await getMessages(sessionId);
      setChat(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendIt = async () => {
    if (!typingBox.trim()) {
      setErrorMsg("Please type a message.");
      return;
    }

    try {
      await sendMessage({
        sessionId,
        senderId,
        senderName,
        message: typingBox,
        messageType: "TEXT",
      });

      setTypingBox("");
      setErrorMsg("");

      loadMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const removeMessage = async (id) => {
    try {
      await deleteMessage(id);
      loadMessages();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  useEffect(() => {
    socket.on("chat-permission", setCanChat);

    return () => {
      socket.off("chat-permission");
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

  return (
    <div className="chatBox">
      <div className="chatTitle">💬 Classroom Chat</div>

      <div className="msgArea">
        {chat.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          chat.map((chatItem) => (
            <div
              key={chatItem.id}
              className={`msg ${
                chatItem.senderId === senderId ? "yourMsg" : "trainerMsg"
              }`}
            >
              <strong>{chatItem.senderName}</strong>

              <div className="messageText">{chatItem.message}</div>

              {(role === "TRAINER" || role === "ADMIN") && (
                <button
                  className="deleteBtn"
                  onClick={() => removeMessage(chatItem.id)}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          ))
        )}

        <div ref={messageEndRef} />
      </div>

      {errorMsg && <div className="errMsg">{errorMsg}</div>}

      <div className="inputPart">
        <input
          type="text"
          placeholder={canChat ? "Type your message..." : "Chat Disabled"}
          value={typingBox}
          disabled={!canChat}
          onChange={(e) => {
            setTypingBox(e.target.value);

            if (errorMsg) {
              setErrorMsg("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendIt();
            }
          }}
        />

        <button onClick={sendIt} disabled={!canChat}>
          Send
        </button>
      </div>
    </div>
  );
}
