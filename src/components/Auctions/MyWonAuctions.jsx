import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

import { 
    FaMusic, 
    FaBook, 
    FaPaintBrush, 
    FaCube, 
    FaLayerGroup,
    FaCheckCircle,
    FaClock
} from 'react-icons/fa';

const MyWonAuctions = () => {
  useDocumentTitle('Vartica  | Mis Adquisiciones');

  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWonAuctions();
  }, []);

  const loadWonAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionService.getWonAuctions();
      const collection = Array.isArray(response) ? response : (response?.data || []);
      setWonAuctions(collection);
      setError('');
    } catch (err) {
      console.error('Error al cargar victorias:', err);
      setError('No pudimos cargar tus premios. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Helper para iconos y colores según área
  const getAreaConfig = (areaName) => {
    const name = areaName?.toLowerCase() || '';
    switch (name) {
      case 'musica':
      case 'música':
        return { icon: <FaMusic />, color: 'text-pink-600 bg-pink-50 border-pink-200' };
      case 'literatura':
        return { icon: <FaBook />, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'pintura':
        return { icon: <FaPaintBrush />, color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'modelado':
      case 'escultura':
        return { icon: <FaCube />, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      default:
        return { icon: <FaLayerGroup />, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <span className="text-4xl">🏆</span>
                <span className="text-black dark:text-white">Mis Adquisiciones</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Felicidades, aquí están las obras que has ganado. Completa el pago para recibirlas.
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/auctions">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  🎨 Ver más subastas
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Buscando tus victorias...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-3">{error}</p>
                <button
                  onClick={loadWonAuctions}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  🔄 Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && wonAuctions.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-7xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Aún no has ganado ninguna subasta
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¡No te rindas! Revisa las subastas activas y realiza tu mejor puja.
            </p>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all hover:shadow-md"
            >
              🚀 Ir a Subastar
            </Link>
          </div>
        )}

        {/* Grid de Ganadas */}
        {!loading && !error && wonAuctions.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tienes{' '}
                <span className="font-bold text-teal-600">{wonAuctions.length}</span>{' '}
                obras ganadas esperando confirmación.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonAuctions.map((auction) => {
                const isPaid = auction.pago_status === 'pagado';
                const areaName = auction.obra?.area?.nombre;
                const areaConfig = getAreaConfig(areaName);

                return (
                  <div
                    key={auction.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden flex flex-col h-full group transition-all hover:shadow-md 
                    ${isPaid ? 'border-green-200 dark:border-green-900' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    {/* Badge */}
                    <div
                      className={`absolute top-3 right-3 z-10 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1
                      ${isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}
                    >
                      {isPaid ? <><FaCheckCircle /> PAGADO</> : <><FaClock /> PENDIENTE</>}
                    </div>

                    {/* Imagen */}
                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                      {auction.obra?.imagen_url ? (
                        <img
                          src={auction.obra.imagen_url}
                          alt={auction.obra.nombre}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-4xl ${areaConfig.color}`}>
                          {areaConfig.icon}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${areaConfig.color}`}>
                          {areaConfig.icon}
                          {areaName || 'Sin Área'}
                        </span>
                      </div>

                      <h3
                        className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1"
                        title={auction.obra?.nombre}
                      >
                        {auction.obra?.nombre || 'Obra sin título'}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        por {auction.obra?.artist?.alias || 'Artista desconocido'}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Precio Final</span>
                          <span className={`text-xl font-bold ${isPaid ? 'text-green-600' : 'text-teal-600'}`}>
                            ${parseFloat(auction.precio_actual).toLocaleString()}
                          </span>
                        </div>

                        {isPaid ? (
                          <Link
                            to={`/auctions/certificate/${auction.id}`}
                            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors font-medium"
                          >
                            📜 Ver Certificado
                          </Link>
                        ) : (
                          <Link
                            to={`/checkout/${auction.id}`}
                            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-medium rounded-lg transition-colors shadow-lg shadow-teal-900/20"
                          >
                            💳 Pagar Ahora
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyWonAuctions;
