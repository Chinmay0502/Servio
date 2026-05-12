import axios from "axios";

const api = axios.create({
  baseURL: "https://servio-sqk2.onrender.com/api",
  withCredentials: true,
});

export default api;