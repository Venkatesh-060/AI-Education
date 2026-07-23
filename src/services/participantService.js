import axios from "axios";

const API = "http://localhost:8080/api/participants";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// Join Classroom
export const joinParticipant = (data) =>
  axios.post(`${API}/join`, data, authHeader());

// Get Participants
export const getParticipants = (sessionId) =>
  axios.get(`${API}/${sessionId}`, authHeader());

// Remove Participant
export const removeParticipant = (id) =>
  axios.put(`${API}/remove/${id}`, {}, authHeader());

// Allow Rejoin
export const allowRejoin = (id) =>
  axios.put(`${API}/allow/${id}`, {}, authHeader());

// Disconnect Participant
export const disconnectParticipant = (data) =>
  axios.put(`${API}/disconnect`, data, authHeader());
