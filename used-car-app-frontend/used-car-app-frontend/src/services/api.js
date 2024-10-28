// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/users'; // Adjust to your backend URL if needed

// Axios instance for our API
const api = axios.create({
  baseURL: API_URL,
});

// Function to register a new user
export const registerUser = async (userData) => {
  return await api.post('/register', userData);
};

// Function to log in a user
export const loginUser = async (userData) => {
  return await api.post('/login', userData);
};

export default api;
