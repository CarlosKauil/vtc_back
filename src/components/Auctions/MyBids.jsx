// src/pages/Auctions/MyBids.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';


/**
 * Historial de pujas del usuario autenticado
 * Muestra todas las pujas realizadas con estado de la subasta
 */
const MyBids = () => {
  useDocumentTitle('Vartica | Mis Pujas');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, winning, lost, active

  /**
   * Cargar pujas al montar el componente
   */
  useEffect(() => {
    loadMyBids();
  }, []);

  /**
   * Función para cargar las pujas del usuario
   */
  const loadMyBids = async () => {
    try {
      setLoading(true);
      const data = await auctionService.getMyBids();
      setBids(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar pujas:', err);
      setError('Error al cargar tus pujas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Construir URL de imagen funcional
   */
  const getImageUrl = (obra) => {
    if (!obra) return 'https://via.placeholder.com/200?text=Sin+Imagen';
    
    const imagePath = obra.imagen || obra.archivo;
    if (imagePath) {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `http://localhost:8000/storage/${imagePath}`;
    }
    
    return 'https://via.placeholder.com/200?text=Sin+Imagen';
  };

  /**
   * Filtrar pujas según el filtro seleccionado
   */
  const getFilteredBids = () => {
    switch(filter) {
      case 'winning':
        return bids.filter(bid => !bid.subasta_finalizada && bid.es_ganadora);
      case 'lost':
        return bids.filter(bid => bid.subasta_finalizada && !bid.es_ganadora);
      case 'active':
        return bids.filter(bid => !bid.subasta_finalizada);
      default:
        return bids;
    }
  };

  const filteredBids = getFilteredBids();

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando tus pujas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">📊</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-black ">
              Mis Pujas
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Historial completo de todas tus pujas realizadas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Pujas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bids.length}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ganando</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {bids.filter(b => !b.subasta_finalizada && b.es_ganadora).length}
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Activas</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {bids.filter(b => !b.subasta_finalizada).length}
                </p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Finalizadas</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {bids.filter(b => b.subasta_finalizada).length}
                </p>
              </div>
              <div className="text-3xl">🏁</div>
            </div>
          </div>
        </div>

        {/* Filter and Refresh Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              📋 Todas ({bids.length})
            </button>
            <button
              onClick={() => setFilter('winning')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'winning'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              🥇 Ganando ({bids.filter(b => !b.subasta_finalizada && b.es_ganadora).length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'active'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ⏳ Activas ({bids.filter(b => !b.subasta_finalizada).length})
            </button>
            <button
              onClick={() => setFilter('lost')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'lost'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ❌ Perdidas ({bids.filter(b => b.subasta_finalizada && !b.es_ganadora).length})
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadMyBids}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            <span>🔄</span>
            <span>Actualizar</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-3 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl mb-6">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-2">{error}</p>
              <button
                onClick={loadMyBids}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredBids.length === 0 && filter === 'all' && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-7xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No has realizado ninguna puja
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Explora las subastas activas y realiza tu primera puja para comenzar a participar
            </p>
            <Link to="/auctions">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5">
                <span>🔍</span>
                <span>Ver Subastas Activas</span>
              </button>
            </Link>
          </div>
        )}

        {/* Empty Filter State */}
        {!error && filteredBids.length === 0 && filter !== 'all' && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-600 dark:text-gray-400">
              No hay pujas en esta categoría
            </p>
          </div>
        )}

        {/* Lista de Pujas */}
        {!error && filteredBids.length > 0 && (
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  
                  {/* Imagen de la obra */}
                  <Link
                    to={`/auctions/${bid.obra?.id}`}
                    className="md:w-56 h-56 md:h-auto flex-shrink-0 group"
                  >
                    <div className="relative h-full rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700">
                      <img
                        src={getImageUrl(bid.obra)}
                        alt={bid.obra?.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Error';
                        }}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                  </Link>

                  {/* Información de la puja */}
                  <div className="flex-1 space-y-4">
                    
                    {/* Título de la obra */}
                    <div>
                      <Link to={`/auctions/${bid.obra?.id}`}>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                          {bid.obra?.titulo || 'Título no disponible'}
                        </h3>
                      </Link>
                      {bid.obra?.artista && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          por <span className="font-medium">{bid.obra.artista}</span>
                        </p>
                      )}
                    </div>

                    {/* Detalles de la puja en grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">
                          Tu Puja
                        </p>
                        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          ${parseFloat(bid.monto).toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium uppercase tracking-wide">
                          Fecha de Puja
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {new Date(bid.fecha_puja).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {new Date(bid.fecha_puja).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Estado de la subasta */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {bid.subasta_finalizada ? (
                        <>
                          {bid.es_ganadora ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg font-bold text-sm">
                              <span className="text-lg">🏆</span>
                              <span>¡Ganaste esta subasta!</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm">
                              <span className="text-lg">❌</span>
                              <span>No ganaste esta subasta</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {bid.es_ganadora ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg font-bold text-sm">
                              <span className="text-lg">🥇</span>
                              <span>Vas ganando</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg font-medium text-sm">
                              <span className="text-lg">⏳</span>
                              <span>Alguien pujó más alto</span>
                            </span>
                          )}
                        </>
                      )}

                      <Link to={`/auctions/${bid.obra?.id}`} className="ml-auto">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm">
                          <span>👁️</span>
                          <span>Ver Subasta</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination placeholder (si lo necesitas más adelante) */}
        {filteredBids.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredBids.length} {filteredBids.length === 1 ? 'puja' : 'pujas'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBids;
