import axios from "axios";

const API = "http://localhost:8080/api/whiteboard";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getBoard = (sessionId) => {
  return axios.get(`${API}/${sessionId}`, authHeader());
};

export const saveBoard = (data) => {
  return axios.post(`${API}/save`, data, authHeader());
};

export const clearBoard = (sessionId) => {
  return axios.delete(`${API}/${sessionId}`, authHeader());
};
