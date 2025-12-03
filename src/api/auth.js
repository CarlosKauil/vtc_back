import api from './axios';
import axios from 'axios';


export const login = async (email, password) => {
  // CSRF token debe venir del dominio raíz, no de /api
  await axios.get('https://backend-z57u.onrender.com/sanctum/csrf-cookie', {
    withCredentials: true
  });

  // Ahora sí, login dentro de /api
  const response = await api.post('/login', { email, password });
  return response.data;
};
// ======= AUTENTICACIÓN Y USUARIO =======

 

// Registro usuario general
export const register = async (name, email, password, role) => {
  const response = await api.post('/register', { name, email, password, role });
  return response.data;
};

// Registro artista
export const artistRegister = async (data) => {
  // data incluye: { name, email, password, password_confirmation, alias, fecha_nacimiento, area_id }
  const response = await api.post('/artist-register', data);
  return response.data;
};

// Logout local en frontend
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario autenticado (protegido)
export const getUser = async (token) => {
  const response = await api.get('/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Endpoint solo admin (protegido)
export const adminOnly = async (token) => {
  const response = await api.get('/admin-only', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



// ======= ÁREAS (CRUD) =======

export const getAreas = async () => {
  const response = await api.get('/areas');
  return response.data;
};
