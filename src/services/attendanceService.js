import axios from "axios";

const API = "http://localhost:8080/api/attendance";

export const getAllAttendance = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStudentAttendance = (id) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/student/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSessionAttendance = (id) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/session/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
