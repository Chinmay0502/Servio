import axios from "axios";

const privateAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export default privateAxios;