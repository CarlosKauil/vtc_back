import { useState, useEffect } from 'react';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { format } from 'date-fns';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';


import { 
    FaMusic, 
    FaBook, 
    FaPaintBrush, 
    FaCube, 
    FaLayerGroup 
} from 'react-icons/fa';


const AdminAuctions = () => {
    useDocumentTitle('Vartica | Gestión de Subastas y Ventas');
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({ total_ventas: 0, pendientes_pago: 0, activas: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await auctionService.getAdminReport();
      setAuctions(data.auctions);
      setStats(data.stats);
    } catch (error) {
      console.error("Error cargando reporte", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener icono y estilo según el área
  const getAreaConfig = (areaName) => {
    const name = areaName?.toLowerCase() || '';
    switch (name) {
        case 'musica':
        case 'música':
            return { icon: <FaMusic />, color: 'text-pink-600 bg-pink-100', borderColor: 'border-pink-200' };
        case 'literatura':
            return { icon: <FaBook />, color: 'text-blue-600 bg-blue-100', borderColor: 'border-blue-200' };
        case 'pintura':
            return { icon: <FaPaintBrush />, color: 'text-orange-600 bg-orange-100', borderColor: 'border-orange-200' };
        case 'modelado':
        case 'escultura':
            return { icon: <FaCube />, color: 'text-purple-600 bg-purple-100', borderColor: 'border-purple-200' };
        default:
            return { icon: <FaLayerGroup />, color: 'text-gray-600 bg-gray-100', borderColor: 'border-gray-200' };
    }
  };

  const filteredAuctions = auctions.filter(auc => {
    if (filter === 'all') return true;
    if (filter === 'paid') return auc.pago_status === 'pagado';
    if (filter === 'pending_pay') return auc.estado === 'finalizada' && auc.pago_status !== 'pagado';
    if (filter === 'active') return auc.estado === 'activa';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Subastas y Ventas</h1>
            <button onClick={loadData} className="text-teal-600 hover:text-teal-800">🔄 Actualizar</button>
        </div>

        {/* --- CARDS DE MÉTRICAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">Ingresos Totales (Pagado)</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${parseFloat(stats.total_ventas).toLocaleString()}
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm">Pendientes de Cobro</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendientes_pago}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm">Subastas Activas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activas}</p>
            </div>
        </div>

        {/* --- FILTROS --- */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
                { key: 'all', label: 'Todas' },
                { key: 'active', label: 'Activas' },
                { key: 'pending_pay', label: 'Cobro Pendiente' },
                { key: 'paid', label: 'Pagadas / Finalizadas' },
            ].map((f) => (
                <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filter === f.key 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>

        {/* --- TABLA --- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Obra</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Área</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ganador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio Final</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pago</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                        <tr><td colSpan="8" className="p-4 text-center">Cargando datos...</td></tr>
                    ) : filteredAuctions.length === 0 ? (
                        <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay registros</td></tr>
                    ) : (
                        filteredAuctions.map((auc, index) => {
                            // Configuración visual según el área
                            const areaName = auc.obra?.area?.nombre;
                            const areaConfig = getAreaConfig(areaName);

                            return (
                                <tr key={auc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    {/* Columna # (Conteo) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {index + 1}
                                    </td>
                                    
                                    {/* Columna Obra (Imagen o Icono de Área) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                {auc.obra?.imagen_url ? (
                                                    <img className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600" src={auc.obra.imagen_url} alt="" />
                                                ) : (
                                                    // Si no hay imagen, mostramos el ICONO DEL ÁREA
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg border ${areaConfig.color} ${areaConfig.borderColor}`}>
                                                        {areaConfig.icon}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white max-w-[150px] truncate" title={auc.obra?.nombre}>
                                                    {auc.obra?.nombre}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Columna Área (Etiqueta) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${areaConfig.color}`}>
                                            {areaConfig.icon}
                                            <span>{areaName || 'Sin Área'}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${auc.estado === 'activa' ? 'bg-green-100 text-green-800' : 
                                              auc.estado === 'programada' ? 'bg-blue-100 text-blue-800' : 
                                              auc.estado === 'finalizada' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                                            {auc.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {auc.ganador?.name || (auc.estado === 'finalizada' ? 'Desierta' : '-')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                        ${parseFloat(auc.precio_actual).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {auc.pago_status === 'pagado' ? (
                                            <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                                                ✅ PAGADO
                                            </span>
                                        ) : auc.estado === 'finalizada' && auc.ganador_id ? (
                                            <span className="text-yellow-600 font-bold text-xs flex items-center gap-1">
                                                ⚠️ PENDIENTE
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {auc.pago_status === 'pagado' && auc.fecha_pago
                                            ? format(new Date(auc.fecha_pago), 'dd/MM/yyyy HH:mm')
                                            : format(new Date(auc.fecha_fin), 'dd/MM/yyyy HH:mm')
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAuctions;