import axios from "axios";

const API = "http://localhost:8080/api/chat";

export const getMessages = (sessionId) => {

    const token = localStorage.getItem("token");

    return axios.get(
        `${API}/session/${sessionId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
};


export const sendMessage = (data) => {

    const token = localStorage.getItem("token");

    return axios.post(
        API,
        data,
        {
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            }
        }
    );
};


// ADD THIS
export const deleteMessage = (messageId) => {

    const token = localStorage.getItem("token");

    return axios.delete(
        `${API}/${messageId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
};