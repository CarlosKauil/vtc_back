// src/pages/Auctions/AuctionDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Countdown from '../../components/Auctions/Countdown';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import EditDeadlineModal from '../../components/Auctions/EditDeadlineModal';

/**
 * Vista detallada de una subasta específica
 * 
 * ✨ ACTUALIZADO CON LÓGICA CORREGIDA:
 * - Admin NO puede pujar (solo gestiona)
 * - Artistas SÍ pueden pujar (excepto sus propias obras)
 * - Users SÍ pueden pujar
 * - Modal para editar hora límite (solo Admin)
 */
const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);

  // ✨ Obtener usuario del localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  };

  const user = getCurrentUser();

  useEffect(() => {
    loadAuctionDetail();
  }, [id]);

  const loadAuctionDetail = async () => {
  try {
    setLoading(true);
    const data = await auctionService.getAuctionById(id);
    setAuction(data);
    setError('');
  } catch (err) {
    // Detectar prohibición por Policy (artista dueño o error backend)
    if (err.response?.status === 403 || err.response?.data?.error?.includes("No puedes visualizar")) {
      setError('No tienes permisos para ver esta subasta. (Eres el artista dueño)');
      setTimeout(() => navigate('/auctions'), 3000); // Redirigir tras 3 seg
    } else {
      setError('Error al cargar la subasta. Puede que no exista.');
    }
  } finally {
    setLoading(false);
  }
};


  /**
   * Construir URL de imagen funcional
   */
  const getImageUrl = (obra) => {
    if (!obra) return 'https://via.placeholder.com/600x800?text=Sin+Imagen';
    
    const imagePath = obra.imagen || obra.archivo;
    if (imagePath) {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `https://backend-z57u.onrender.com/storage/${imagePath}`;
    }
    
    return 'https://via.placeholder.com/600x800?text=Sin+Imagen';
  };

  /**
   * ✨ FUNCIÓN CORREGIDA: Verificar si el usuario puede pujar
   * 
   * LÓGICA ACTUALIZADA:
   * 1. Usuario debe estar autenticado
   * 2. Admin NO puede pujar (solo gestiona)
   * 3. Artistas SÍ pueden pujar (excepto sus propias obras)
   * 4. Users SÍ pueden pujar
   * 5. La subasta debe estar activa
   */
  const canUserBid = () => {
    // 1. Usuario debe estar autenticado
    if (!user) {
      return { 
        canBid: false, 
        reason: 'Debes iniciar sesión para pujar',
        type: 'login'
      };
    }
    
    // 2. Admin NO puede pujar (solo gestiona)
    if (user.role === 'Admin') {
      return {
        canBid: false,
        reason: 'Los administradores no pueden participar en las pujas',
        type: 'role'
      };
    }
    
    // 3. El artista no puede pujar su propia obra
    // Esta validación SOLO aplica si el usuario es un Artista
    // Los Users pueden pujar cualquier obra
    const userArtistId = user.artists?.id || user.artist?.id;
    const obraArtistId = auction.obra?.artist_id;
    
    if (userArtistId && obraArtistId && userArtistId === obraArtistId) {
      return { 
        canBid: false, 
        reason: 'No puedes pujar en tu propia obra',
        type: 'owner'
      };
    }
    
    // 4. La subasta debe estar activa
    if (!auction.is_activa) {
      return { 
        canBid: false, 
        reason: 'Esta subasta no está activa o ya finalizó',
        type: 'inactive'
      };
    }
    
    // ✅ Si pasó todas las validaciones, puede pujar
    return { canBid: true, reason: '', type: '' };
  };

  const bidValidation = auction ? canUserBid() : { canBid: false, reason: '', type: '' };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    const amount = parseFloat(bidAmount);
    const minBid = parseFloat(auction.precio_actual) + parseFloat(auction.incremento_minimo);

    if (isNaN(amount) || amount < minBid) {
      setBidError(`El monto mínimo es $${minBid.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      await auctionService.placeBid(auction.id, amount);
      setBidSuccess('¡Puja realizada exitosamente!');
      setBidAmount('');
      
      loadAuctionDetail();

      setTimeout(() => setBidSuccess(''), 3000);
    } catch (err) {
      setBidError(err.message || err.response?.data?.error || 'Error al realizar la puja');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ✨ Handler para actualizar deadline
   */
  const handleDeadlineUpdated = () => {
    setShowEditDeadlineModal(false);
    loadAuctionDetail();
  };

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando subasta...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error || !auction) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error || 'Subasta no encontrada'}</p>
            <Link to="/auctions">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all">
                <span>←</span>
                <span>Volver a Subastas</span>
              </button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const minBid = parseFloat(auction.precio_actual) + parseFloat(auction.incremento_minimo);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            to="/auctions" 
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium transition-all duration-200 hover:gap-2"
          >
            <span>←</span>
            <span>Volver a Subastas</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Columna Izquierda: Imagen de la Obra */}
          <div className="space-y-6">
            
            {/* Imagen Principal */}
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500 to-purple-700">
              <img
                src={getImageUrl(auction.obra)}
                alt={auction.obra?.titulo}
                className="w-full h-auto object-contain max-h-[300px]"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x800?text=Error+al+cargar';
                }}
              />
              
              {/* Badge de estado */}
              <div className="absolute top-4 right-4">
                {auction.is_activa ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    En Vivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                    <span>🔒</span>
                    Finalizada
                  </span>
                )}
              </div>

              {/* ✨ Botón editar deadline (solo Admin) */}
              {user?.role === 'Admin' && auction.is_activa && (
                <div className="absolute top-4 left-4">
                  <button
                    onClick={() => setShowEditDeadlineModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
                  >
                    <span>⏰</span>
                    <span>Editar Hora Límite</span>
                  </button>
                </div>
              )}
            </div>

            {/* Información de la obra */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                <span>📋</span>
                <span>Información de la Obra</span>
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Descripción:</p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {auction.obra?.descripcion || 'Sin descripción disponible'}
                  </p>
                </div>
                
                {auction.obra?.artist?.user && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Artista:</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {auction.obra.artist.user.name}
                    </p>
                  </div>
                )}

                {auction.obra?.area && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Área:</p>
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                      <span>🎨</span>
                      <span>{auction.obra.area.nombre || auction.obra.area}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información de la Subasta */}
          <div className="space-y-6">
            
            {/* Título */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {auction.obra?.titulo}
              </h1>
              {auction.obra?.artist?.user && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  AUTOR DE LA OBRA: <h2 className="font-semibold text-black ">{auction.obra.artist.user.name}</h2>
                </p>
              )}
            </div>

            {/* Countdown */}
            {auction.is_activa && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6 text-center">
                <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  <span className="text-2xl">⏱️</span>
                  <span>Tiempo Restante</span>
                </h3>
                <div className="flex justify-center">
                  <Countdown 
                    fechaFin={auction.fecha_fin} 
                    onExpire={() => loadAuctionDetail()}
                  />
                </div>
              </div>
            )}
            <div className="p-3">

            </div>

            {/* Información de precios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                <span>💰</span>
                <span>Información de Precios</span>
              </h3>
              <div className="space-y-4">
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Precio Inicial:</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ${parseFloat(auction.precio_inicial).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Precio Actual:</span>
                  <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    ${parseFloat(auction.precio_actual).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Incremento Mínimo:</span>
                  <span className="text-lg font-semibold text-amber-600 dark:text-amber-500">
                    +${parseFloat(auction.incremento_minimo).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total de Pujas:</span>
                  <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                    {auction.total_pujas || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* ✨ Formulario de puja con validaciones de rol CORREGIDAS */}
            {auction.is_activa && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-teal-200 dark:border-teal-800 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                  <span>🎯</span>
                  <span>Realizar Puja</span>
                </h3>
                
                {/* ✨ Mostrar mensaje si no puede pujar */}
                {!bidValidation.canBid ? (
                  <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div>
                      <p className="font-semibold text-base mb-1">{bidValidation.reason}</p>
                      
                      {bidValidation.type === 'role' && user?.role === 'Admin' && (
                        <p className="text-sm mt-2">Como administrador, puedes gestionar las subastas pero no participar en ellas.</p>
                      )}
                      
                      {bidValidation.type === 'login' && (
                        <Link to="/login" className="inline-flex items-center gap-1 mt-3 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                          <span>→</span>
                          <span>Iniciar sesión</span>
                        </Link>
                      )}

                      {bidValidation.type === 'owner' && (
                        <p className="text-sm mt-2">Esta es tu obra. Solo otros artistas o usuarios pueden pujar por ella.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Monto de tu Puja
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-lg">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={minBid.toFixed(2)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                          min={minBid}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <span>ℹ️</span>
                        <span>Siguiente puja mínima: <strong>${minBid.toFixed(2)}</strong></span>
                      </p>
                    </div>

                    {/* Mensajes de error/éxito */}
                    {bidError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        <span className="text-lg flex-shrink-0">⚠️</span>
                        <span>{bidError}</span>
                      </div>
                    )}
                    
                    {bidSuccess && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
                        <span className="text-lg flex-shrink-0">✅</span>
                        <span>{bidSuccess}</span>
                      </div>
                    )}

                    {/* Botón de puja */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span>💰</span>
                          <span>Confirmar Puja</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Ganador (si la subasta finalizó) */}
            {!auction.is_activa && auction.ganador && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  <span className="text-3xl">🏆</span>
                  <span>Ganador</span>
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
                  <strong className="text-gray-900 dark:text-gray-100">{auction.ganador.name}</strong> ganó esta subasta con una puja de:
                </p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-3">
                  ${parseFloat(auction.precio_actual).toFixed(2)}
                </p>
              </div>
            )}

            {/* Historial de Pujas */}
            {auction.bids && auction.bids.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                  <span>📊</span>
                  <span>Historial de Pujas</span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {auction.bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`flex justify-between items-center p-4 rounded-lg transition-all ${
                        index === 0
                          ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-700 shadow-md'
                          : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <span className="text-2xl">🏆</span>}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {bid.user?.name || 'Usuario Anónimo'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(bid.fecha_puja).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {new Date(bid.fecha_puja).toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                          ${parseFloat(bid.monto).toFixed(2)}
                        </p>
                        {index === 0 && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                            Puja más alta
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✨ Modal para editar deadline */}
      {showEditDeadlineModal && (
        <EditDeadlineModal
          auction={auction}
          onClose={() => setShowEditDeadlineModal(false)}
          onSuccess={handleDeadlineUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default AuctionDetail;
