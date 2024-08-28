import axios from "axios";

export default axios.create({
  baseURL: "https://financas-back.onrender.com/",
  // baseURL: "http://localhost:3005/",
  withCredentials: true,
});