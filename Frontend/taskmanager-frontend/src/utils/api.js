import axios from "axios";

const api = axios.create({
  baseURL: "https://taskmanagerapp-backend-m1rz.onrender.com/api",
  withCredentials: true
});

export default api;