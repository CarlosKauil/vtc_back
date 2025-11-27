import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getObrasAceptadas } from "../api/obras";
import { FileText, Users, Briefcase, ChevronDown } from "lucide-react";
import ObraDetalleModal from "./ObraDetalleModal";
import { useDocumentTitle } from '../hooks/useDocumentTitle';


export default function ObrasAceptadas() {
  useDocumentTitle("Vartica | Obras Aceptadas");
const [obras, setObras] = useState([]);
const [contador, setContador] = useState({});
const [areaSeleccionada, setAreaSeleccionada] = useState("");
const [loading, setLoading] = useState(true);
const [obraSeleccionada, setObraSeleccionada] = useState(null);

const areas = [
{ id: "", nom_area: "Todas las áreas" },
{ id: "1", nom_area: "Modelado" },
{ id: "2", nom_area: "Música" },
{ id: "3", nom_area: "Literatura" },
{ id: "4", nom_area: "Pintura" },
];

const obtenerObras = async (areaId = "") => {
setLoading(true);
try {
const allData = await getObrasAceptadas();


  const obrasFiltradas = areaId
    ? allData.filter((obra) => obra.area_id === parseInt(areaId))
    : allData;

  const contadorPorArea = obrasFiltradas.reduce((acc, obra) => {
    const area = obra.area?.nom_area || "Sin área";
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});

  setObras(obrasFiltradas);
  setContador(contadorPorArea);
} catch (error) {
  console.error("Error al cargar obras aceptadas:", error);
} finally {
  setLoading(false);
}


};

useEffect(() => {
obtenerObras();
}, []);

const totalObras = obras.length;

const LoadingSpinner = () => ( <div className="flex justify-center items-center py-12"> <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div> <p className="ml-3 text-gray-600">Cargando obras...</p> </div>
);

return ( <DashboardLayout> <div className="p-4 md:p-8 bg-gray-50 min-h-screen"> 
  <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-2">Galería de Obras Aceptadas </h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-indigo-600 text-white shadow-lg p-5 rounded-2xl transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90 font-medium">TOTAL DE OBRAS</p>
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="text-4xl font-bold mt-1">{totalObras}</p>
        </div>

        {Object.entries(contador).map(([area, cantidad]) => (
          <div
            key={area}
            className="bg-white shadow-md p-5 rounded-2xl border border-gray-100 transition-shadow hover:shadow-xl duration-300"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase truncate mb-1">
              {area}
            </p>
            <p className="text-3xl font-extrabold text-indigo-700">
              {cantidad}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 md:mb-0">
          Listado Detallado
        </h3>

        <div className="relative inline-flex items-center">
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out font-medium shadow-sm"
            value={areaSeleccionada}
            onChange={(e) => {
              setAreaSeleccionada(e.target.value);
              obtenerObras(e.target.value);
            }}
          >
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nom_area}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Nombre de la Obra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Archivo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {obras.length > 0 ? (
                  obras.map((obra) => (
                    <tr
                      key={obra.id}
                      className="hover:bg-indigo-50/50 transition duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {obra.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {obra.area?.nom_area || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {obra.user?.name || "Desconocido"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setObraSeleccionada(obra)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out font-semibold group"
                        >
                          <FileText className="w-4 h-4 mr-1 transition-transform group-hover:scale-110" />
                          Ver Archivo
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-6 py-12 text-center text-lg text-gray-500 font-medium"
                      colSpan="4"
                    >
                      ¡No se encontraron obras aceptadas para esta área!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>

    {/* Modal para ver detalles o archivo */}
    {obraSeleccionada && (
      <ObraDetalleModal
        obra={obraSeleccionada}
        onClose={() => setObraSeleccionada(null)}
      />
    )}
  </DashboardLayout>


  );
}
