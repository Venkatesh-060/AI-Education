import { useEffect, useState } from "react";
import "../styles/ClassroomChat.css";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../services/chatService";

export default function ClassroomChat({ sessionId }) {
  const [chat, setChat] = useState([]);
  const [typingBox, setTypingBox] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const role = localStorage.getItem("role");
  const senderId = localStorage.getItem("userId");
  const senderName = localStorage.getItem("userName");
  const loadMessages = async () => {
    try {
      const response = await getMessages(sessionId);
      setChat(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  const sendIt = async () => {
    if (typingBox.trim() === "") {
      setErrorMsg("Please type a message before sending.");
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
      console.log(error);
    }
  };

  const removeMessage = async (id) => {
    try {
      await deleteMessage(id);
      loadMessages();
    } catch (error) {
      console.log(error);
    }
  };

  const enterButton = (e) => {
    if (e.key === "Enter") {
      sendIt();
    }
  };

  return (
    <div className="chatBox">
      <h2 className="chatTitle">Classroom Chat</h2>

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
      </div>

      {errorMsg && <p className="errMsg">{errorMsg}</p>}

      <div className="inputPart">
        <input
          type="text"
          placeholder="Type your message..."
          value={typingBox}
          onChange={(e) => {
            setTypingBox(e.target.value);

            if (errorMsg) {
              setErrorMsg("");
            }
          }}
          onKeyDown={enterButton}
        />

        <button onClick={sendIt}>Send</button>
      </div>
    </div>
  );
}
