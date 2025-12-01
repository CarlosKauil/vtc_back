import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Ajusta según tu URL de Laravel http://localhost:8000 | https://backend-z57u.onrender.com/
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getAreas = async () => {
  const response = await api.get('/api/areas');
  return response.data;
};

export async function createArea(nombre) {
  const response = await api.post('/api/areas', { nombre });
  return response.data;
}