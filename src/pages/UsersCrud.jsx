import { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../api/users';
import DashboardLayout from '../layouts/DashboardLayout';

import { useDocumentTitle } from '../hooks/useDocumentTitle';


const roles = ['Admin', 'Artista', 'User'];

export default function UsersCrud() {
  useDocumentTitle("Vartica | Gestión de Usuarios");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditId(user.id);
    setNewRole(user.role);
  };

  const handleSave = async (id) => {
    try {
      await updateUserRole(id, newRole);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setError('Error al actualizar rol');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 py-8 px-2 md:px-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Usuarios</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 text-base text-gray-800">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {editId === user.id ? (
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {editId === user.id ? (
                        <>
                          <button
                            onClick={() => handleSave(user.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Editar rol
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-6">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}