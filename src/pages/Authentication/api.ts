import axios from "axios";

export default axios.create({
   baseURL: "https://financas-back.onrender.com/",
  //baseURL: "http://localhost:3000/",
  withCredentials: true,
});