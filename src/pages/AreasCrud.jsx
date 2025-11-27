// src/pages/AreasCrud.jsx
import { useState, useEffect } from 'react';
import { getAreas, createArea } from '../api/areas';
import DashboardLayout from '../layouts/DashboardLayout';

import { useDocumentTitle } from '../hooks/useDocumentTitle';



export default function AreasCrud() {
  useDocumentTitle("Vartica | Gestión de Áreas");
  const [areas, setAreas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAreas = async () => {
    const data = await getAreas();
    setAreas(data);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createArea(nombre);
      setSuccess('Área creada');
      setNombre('');
      fetchAreas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear área');
    }
  };

  return (
    <DashboardLayout>
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Registro de Áreas</h2>
  <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
    <input
      placeholder="Nombre del área"
      value={nombre}
      onChange={e => setNombre(e.target.value)}
      required
      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
    />
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition"
    >
      Agregar área
    </button>
  </form>
  {success && <p className="text-green-600 mb-2">{success}</p>}
  {error && <p className="text-red-500 mb-2">{error}</p>}
  <ul className="divide-y divide-gray-200">
    {areas.map(area => (
      <li key={area.id} className="py-2 text-gray-800">{area.nombre}</li>
    ))}
    {areas.length === 0 && (
      <li className="py-2 text-gray-400 text-center">No hay áreas registradas.</li>
    )}
  </ul>
</div>
    </DashboardLayout>
  );
}