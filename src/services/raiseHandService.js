import axios from "axios";

const API = "http://localhost:8080/api/raisehand";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export const raiseHand = (data) =>
  axios.post(`${API}/raise`, data, authHeader());

export const getRaisedHands = (sessionId) =>
  axios.get(`${API}/${sessionId}`, authHeader());

export const approveHand = (id) =>
  axios.put(`${API}/approve/${id}`, {}, authHeader());

export const dismissHand = (id) =>
  axios.put(`${API}/dismiss/${id}`, {}, authHeader());

export const lowerHand = (id) => axios.delete(`${API}/${id}`, authHeader());

export const getStudentHand = (sessionId, studentId) =>
  axios.get(`${API}/student/${sessionId}/${studentId}`, authHeader());
