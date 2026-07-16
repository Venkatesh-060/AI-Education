import axios from "axios";

const API = "http://localhost:8080/api/whiteboard";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveBoard = (data) => axios.post(`${API}/save`, data, auth());

export const getBoard = (sessionId) => axios.get(`${API}/${sessionId}`, auth());

export const clearBoard = (sessionId) =>
  axios.delete(`${API}/${sessionId}`, auth());
