// src/pages/Auctions/AuctionList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuctionCard from '../../components/Auctions/AuctionCard';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';

/**
 * Página principal de subastas
 * Muestra todas las subastas activas en formato de grid
 */
const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    loadAuctions();
    // eslint-disable-next-line
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionService.getActiveAuctions();
      // Laravel paginated: { data: [...], current_page, per_page, ... }
      const collection = Array.isArray(response?.data) ? response.data : [];
      setAuctions(collection);
      setError('');
    } catch (err) {
      console.error('Error al cargar subastas:', err);
      setError('Error al cargar las subastas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidPlaced = () => {
    loadAuctions();
  };

  const getFilteredAndSortedAuctions = () => {
    if (!Array.isArray(auctions)) return [];

    let filtered = [...auctions];

    if (filter === 'ending-soon') {
      filtered = filtered.filter(auction => {
        const hoursLeft = (new Date(auction.fecha_fin) - new Date()) / (1000 * 60 * 60);
        return hoursLeft <= 24;
      });
    } else if (filter === 'new') {
      filtered = filtered.filter(auction => {
        const hoursOld = (new Date() - new Date(auction.fecha_inicio)) / (1000 * 60 * 60);
        return hoursOld <= 24;
      });
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.precio_actual) - parseFloat(b.precio_actual));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.precio_actual) - parseFloat(a.precio_actual));
    } else {
      filtered.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
    }

    return filtered;
  };

  const filteredAuctions = getFilteredAndSortedAuctions();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <span className="text-4xl">🎨</span>
                <span className='text-black'>Subastas Activas</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explora las obras en subasta y realiza tu puja
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/auctions/my-bids">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                  <span>📊</span>
                  <span>Mis Pujas</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando subastas...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-3">{error}</p>
                <button
                  onClick={loadAuctions}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <span>🔄</span>
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && auctions.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="text-7xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No hay subastas activas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vuelve pronto para ver nuevas obras en subasta
            </p>
            <button
              onClick={loadAuctions}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all hover:shadow-md"
            >
              <span>🔄</span>
              <span>Actualizar</span>
            </button>
          </div>
        )}

        {/* Filter and Sort Bar */}
        {!loading && !error && auctions.length > 0 && (
          <>
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredAuctions.length}</span> {filteredAuctions.length === 1 ? 'subasta activa' : 'subastas activas'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filter === 'all'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => setFilter('ending-soon')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filter === 'ending-soon'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ⏰ Por terminar
                      </button>
                      <button
                        onClick={() => setFilter('new')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          filter === 'new'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ✨ Nuevas
                      </button>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="date">Más recientes</option>
                      <option value="price-low">Precio: menor a mayor</option>
                      <option value="price-high">Precio: mayor a menor</option>
                    </select>
                  </div>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <button
                    onClick={loadAuctions}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <span>🔄</span>
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Grid de Subastas */}
            {filteredAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onBidPlaced={handleBidPlaced}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No hay subastas que coincidan con los filtros seleccionados
                </p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setSortBy('date');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium text-sm transition-colors"
                >
                  <span>↺</span>
                  <span>Limpiar filtros</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuctionList;
