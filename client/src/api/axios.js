import axios from "axios";

const token = localStorage.getItem("token");

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Authorization: token ? `Bearer ${token}` : "" },
});
