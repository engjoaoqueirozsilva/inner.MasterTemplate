// src/services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://seu-endpoint/api", // ajuste para seu endpoint real
  headers: {
    "x-api-key": "0c4d8a79-bde6-4e3a-a2ef-5c6e95727e2e"
  }
});

export default axiosInstance;
