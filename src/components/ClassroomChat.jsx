import React, { useState } from "react";
import "../styles/ClassroomChat.css";

export default function ClassroomChat() {
  const [chat, setChat] = useState([
    {
      sender: "Trainer",
      text: "Good morning everyone! Let's begin our discussion.",
    },
  ]);

  const [typingBox, setTypingBox] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const sendIt = () => {
    if (typingBox.trim() === "") {
      setErrorMsg("Please type a message before sending.");
      return;
    }

    const myMsg = {
      sender: "You",
      text: typingBox.trim(),
    };

    setChat([...chat, myMsg]);
    setTypingBox("");
    setErrorMsg("");
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
        {chat.map((chatItem, index) => (
          <div
            key={index}
            className={`msg ${
              chatItem.sender === "Trainer" ? "trainerMsg" : "yourMsg"
            }`}
          >
            <strong>{chatItem.sender}</strong>
            <div>{chatItem.text}</div>
          </div>
        ))}
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