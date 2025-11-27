import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-z57u.onrender.com', //https://backend-z57u.onrender.com/ , http://localhost:8000/api
});

// ======= AUTENTICACIÓN Y USUARIO =======

// Login
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

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
