// src/services/axiosInstance.js
import axios from "axios";

const API_BASE_URL = 'http://harkonen.ia-outsider.com.br/api'; 
const API_KEY = '0c4d8a7a-bde6-4e3a-a2ef-5cde95727e2e';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
  /*,
  headers: {
    "x-api-key": API_KEY
  }*/
});

axiosInstance.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");

  if (userId) config.headers["x-user-id"] = userId;

  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
