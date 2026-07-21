import axios from "axios";

const API = "http://localhost:8080/api/chat";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// Get all messages of a session
export const getMessages = (sessionId) => {
  return axios.get(
    `${API}/session/${sessionId}`,
    authHeader()
  );
};

// Send a message
export const sendMessage = (data) => {
  return axios.post(
    `${API}/send`,
    data,
    authHeader()
  );
};

// Delete a message
export const deleteMessage = (messageId) => {
  return axios.delete(
    `${API}/${messageId}`,
    authHeader()
  );
};