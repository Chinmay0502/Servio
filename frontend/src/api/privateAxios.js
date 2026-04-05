import axios from "axios";

const privateAxios = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export default privateAxios;