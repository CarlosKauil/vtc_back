import api from './axios';
import axios from 'axios';


export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
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

export const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error en logout:', error);
    // Limpiar de todas formas
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Obtener usuario autenticado (protegido)
export const getUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
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
