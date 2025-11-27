import React, { useEffect, useState } from "react";

export default function ObrasAprobadas() {
  const [obras, setObras] = useState([]);
  const [contador, setContador] = useState({});
  const [filtroArea, setFiltroArea] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Asegúrate de tener guardado el token

  const fetchObras = async (area = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/obras-aprobadas${area ? `?area_id=${area}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setObras(data.obras || []);
      setContador(data.contador || {});
    } catch (error) {
      console.error("Error al cargar las obras:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarObra = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta obra?")) return;

    try {
      const response = await fetch(`/api/obras/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        alert("Obra eliminada correctamente.");
        fetchObras(filtroArea);
      } else {
        alert("No se pudo eliminar la obra.");
      }
    } catch (error) {
      console.error("Error al eliminar la obra:", error);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  const handleFiltro = (e) => {
    const area = e.target.value;
    setFiltroArea(area);
    fetchObras(area);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Obras Aprobadas</h1>

      {/* Contadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded-2xl text-center">
          <p className="text-gray-500">Literatura</p>
          <p className="text-2xl font-semibold">{contador.literatura ?? 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-2xl text-center">
          <p className="text-gray-500">Pintura</p>
          <p className="text-2xl font-semibold">{contador.pintura ?? 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-2xl text-center">
          <p className="text-gray-500">Música</p>
          <p className="text-2xl font-semibold">{contador.musica ?? 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-2xl text-center">
          <p className="text-gray-500">Modelado</p>
          <p className="text-2xl font-semibold">{contador.modelado ?? 0}</p>
        </div>
      </div>

      {/* Filtro */}
      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">Filtrar por área:</label>
        <select
          className="border border-gray-300 rounded-xl p-2"
          value={filtroArea}
          onChange={handleFiltro}
        >
          <option value="">Todas</option>
          <option value="3">Literatura</option>
          <option value="4">Pintura</option>
          <option value="2">Música</option>
          <option value="1">Modelado</option>
        </select>
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando obras...</p>
      ) : obras.length === 0 ? (
        <p className="text-gray-500">No hay obras aprobadas en esta área.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-2xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Área</th>
                <th className="py-3 px-4 text-left">Año</th>
                <th className="py-3 px-4 text-left">Artista</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((obra) => (
                <tr
                  key={obra.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{obra.id}</td>
                  <td className="py-3 px-4 font-medium">{obra.nombre}</td>
                  <td className="py-3 px-4">{obra.area?.nombre || "Sin área"}</td>
                  <td className="py-3 px-4">{obra.anio_creacion}</td>
                  <td className="py-3 px-4">{obra.user?.name || "Desconocido"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => eliminarObra(obra.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
