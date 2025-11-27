import api from './axios';

// Listar usuarios
export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

// Editar rol de usuario
export const updateUserRole = async (id, role) => {
  const res = await api.put(`/users/${id}`, { role });
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};