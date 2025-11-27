// src/components/Auctions/AuctionCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import auctionService from '../../api/auctionService';

/**
 * Tarjeta individual de subasta
 * Muestra la obra, precio actual, countdown y permite pujar
 * 
 * ✨ ACTUALIZADO CON:
 * - Validación de rol (Admin NO puede pujar)
 * - Validación de propiedad (Artista no puede pujar su obra)
 * - Botón deshabilitado con tooltip explicativo
 */
const AuctionCard = ({ auction, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  /**
   * ✨ NUEVA FUNCIÓN: Verificar si el usuario puede pujar
   * 
   * LÓGICA:
   * 1. Usuario debe estar autenticado
   * 2. Admin NO puede pujar (solo gestiona)
   * 3. Artista no puede pujar su propia obra
   */
  const canUserBid = () => {
    if (!user) {
      return { canBid: false, reason: 'Debes iniciar sesión para pujar' };
    }
    
    // Admin NO puede pujar
    if (user.role === 'Admin') {
      return { canBid: false, reason: 'Los administradores no pueden pujar' };
    }
    
    // Artista no puede pujar su propia obra
    const userArtistId = user.artists?.id || user.artist?.id;
    const obraArtistId = auction.obra?.artist_id;
    
    if (userArtistId && obraArtistId && userArtistId === obraArtistId) {
      return { canBid: false, reason: 'No puedes pujar en tu propia obra' };
    }
    
    return { canBid: true, reason: '' };
  };

  const bidValidation = canUserBid();

  // Calcular el monto mínimo de puja
  const minBid = parseFloat(auction.precio_actual) + parseFloat(auction.incremento_minimo);

  /**
   * Construir URL de imagen funcional
   */
  const getImageUrl = (obra) => {
    if (!obra) return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    
    const imagePath = obra.imagen || obra.archivo;
    if (imagePath) {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      return `http://localhost:8000/storage/${imagePath}`;
    }
    
    return 'https://via.placeholder.com/400x300?text=Sin+Imagen';
  };

  /**
   * Detectar el tipo de archivo basado en la extensión
   */
  const getFileType = (filePath) => {
    if (!filePath) return 'image';
    
    const ext = filePath.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      return 'image';
    }
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext)) {
      return 'audio';
    }
    if (['glb', 'gltf', 'obj', 'fbx', 'stl', '3ds'].includes(ext)) {
      return '3d';
    }
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
      return 'video';
    }
    
    return 'unknown';
  };

  /**
   * Renderizar preview según el tipo de archivo
   */
  const renderPreview = () => {
    const fileUrl = getImageUrl(auction.obra);
    const filePath = auction.obra?.imagen || auction.obra?.archivo;
    const fileType = getFileType(filePath);
    
    switch(fileType) {
      case 'image':
        return (
          <img
            src={fileUrl}
            alt={auction.obra?.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar';
            }}
          />
        );

      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-rose-700 p-4">
            <div className="text-center text-white mb-4">
              <p className="text-5xl mb-2">🎵</p>
              <p className="text-xs font-semibold">Audio</p>
            </div>
            <audio 
              controls 
              className="w-full max-w-xs"
              src={fileUrl}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        );

      case '3d':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700 p-4">
            <div className="text-center text-white">
              <p className="text-5xl mb-2">🎲</p>
              <p className="text-xs font-semibold mb-1">Modelo 3D</p>
              <p className="text-xs opacity-80">{filePath?.split('.').pop().toUpperCase()}</p>
            </div>
          </div>
        );

      case 'video':
        return (
          <video
            controls
            className="w-full h-full object-cover"
            src={fileUrl}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600">
            <div className="text-center text-white">
              <p className="text-4xl mb-2">📄</p>
              <p className="text-xs">Formato no soportado</p>
            </div>
          </div>
        );
    }
  };

  /**
   * Manejar el envío de la puja
   */
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar monto
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minBid) {
      setError(`El monto mínimo es $${minBid.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await auctionService.placeBid(auction.id, amount);
      setSuccess('¡Puja realizada exitosamente!');
      setBidAmount('');
      
      // Notificar al componente padre para actualizar la lista
      if (onBidPlaced) {
        onBidPlaced(auction.id);
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al realizar la puja');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      
      {/* Imagen de la obra con Preview */}
      <Link to={`/auctions/${auction.id}`} className="block">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 group">
          
          {/* Renderizar vista previa según tipo de archivo */}
          {renderPreview()}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          
          {/* Badge de estado "En Vivo" con animación */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              En Vivo
            </span>
          </div>

          {/* Badge de tipo de archivo */}
          {getFileType(auction.obra?.imagen || auction.obra?.archivo) !== 'image' && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-md text-xs font-semibold">
                {getFileType(auction.obra?.imagen || auction.obra?.archivo) === 'audio' && '🎵'}
                {getFileType(auction.obra?.imagen || auction.obra?.archivo) === '3d' && '🎲'}
                {getFileType(auction.obra?.imagen || auction.obra?.archivo) === 'video' && '🎬'}
              </span>
            </div>
          )}

          {/* Icono de zoom/preview */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Título de la obra */}
        <Link to={`/auctions/${auction.id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2">
            {auction.obra?.titulo}
          </h3>
        </Link>

        {/* Artista */}
        {auction.obra?.artist?.user && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Por: <span className="font-medium text-gray-900 dark:text-gray-100">{auction.obra.artist.user.name}</span>
          </p>
        )}

        {/* Información de precios en grid */}
        <div className="space-y-2 mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Precio Inicial:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ${parseFloat(auction.precio_inicial).toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Precio Actual:</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              ${parseFloat(auction.precio_actual).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Incremento:</span>
            <span className="font-medium text-amber-600 dark:text-amber-500">
              +${parseFloat(auction.incremento_minimo).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Total de Pujas:</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              {auction.total_pujas || 0}
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-4 p-3 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 text-center font-medium flex items-center justify-center gap-1">
            <span>⏱️</span>
            <span>Tiempo Restante</span>
          </p>
          <div className="flex justify-center">
            <Countdown fechaFin={auction.fecha_fin} />
          </div>
        </div>

        {/* ✨ Mensaje si no puede pujar */}
        {!bidValidation.canBid && (
          <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg text-xs">
            <p className="font-semibold flex items-center gap-1">
              <span>⚠️</span>
              <span>{bidValidation.reason}</span>
            </p>
          </div>
        )}

        {/* Formulario de puja - Solo si puede pujar */}
        {bidValidation.canBid ? (
          <form onSubmit={handleBidSubmit} className="space-y-3 mt-auto">
            <div>
              <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                Tu Puja (Mínimo: ${minBid.toFixed(2)})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minBid.toFixed(2)}
                  className="w-full pl-8 pr-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  min={minBid}
                />
              </div>
            </div>

            {/* Mensajes de error/éxito */}
            {error && (
              <div className="flex items-start gap-1.5 text-xs p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">
                <span className="text-sm flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-start gap-1.5 text-xs p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg">
                <span className="text-sm flex-shrink-0">✅</span>
                <span>{success}</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>💰</span>
                    <span>Realizar Puja</span>
                  </>
                )}
              </button>

              <Link to={`/auctions/${auction.id}`} className="block">
                <button 
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm"
                >
                  <span>👁️</span>
                  <span>Ver Detalles</span>
                </button>
              </Link>
            </div>
          </form>
        ) : (
          /* Botón deshabilitado para usuarios que no pueden pujar */
          <div className="space-y-2 mt-auto">
            <button
              disabled
              title={bidValidation.reason}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed text-sm"
            >
              <span>🚫</span>
              <span>No disponible</span>
            </button>

            <Link to={`/auctions/${auction.id}`} className="block">
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm"
              >
                <span>👁️</span>
                <span>Ver Detalles</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
