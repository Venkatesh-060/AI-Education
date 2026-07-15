import axios from "axios";

const API = "http://localhost:8080/api/chat";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const sendMessage = (data) => axios.post(`${API}/send`, data, auth());

export const getMessages = (sessionId) =>
  axios.get(`${API}/session/${sessionId}`, auth());

export const deleteMessage = (id) => axios.delete(`${API}/${id}`, auth());
