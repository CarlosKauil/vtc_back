// src/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-z57u.onrender.com/api', // Cambia esto a la URL de tu API
  //https://lara-backend.onrender.com/api  -  http://localhost:8000/api
  withCredentials: true, // Cambia a true si usas cookies
});

api.defaults.headers.common['Accept'] = 'application/json';



// Agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; // ✅ Esta es la línea clave
