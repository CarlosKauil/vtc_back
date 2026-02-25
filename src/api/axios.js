// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-z57u.onrender.com/api', // Tu URL de backend
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    // NOTA: Con la solución de token, NO necesitas 'withCredentials: true' obligatoriamente,
    // pero puedes dejarlo si no causa conflictos CORS. Lo ideal en este caso es quitarlo o ponerlo en false.
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores 401 (token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir al login solo si no estamos ya ahí
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;