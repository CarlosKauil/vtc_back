import { Link } from 'react-router-dom';

const WonAuctionCard = ({ auction }) => {
  // --- FIX: Validación de Seguridad ---
  // Si auction viene vacío o undefined, no renderizamos nada (o un loader)
  if (!auction) return null;

  // Ahora es seguro desestructurar porque sabemos que auction existe
  // Usamos 'optional chaining' (?.) para obra por si la relación no vino
  const obra = auction.obra || {}; 
  const precio_actual = auction.precio_actual || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full relative group">
      
      {/* Badge de Ganador */}
      <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
        <span>🏆</span> GANADOR
      </div>

      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
        {obra.imagen_url ? (
            <img 
                src={obra.imagen_url} 
                alt={obra.titulo} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">🖼️</span>
            </div>
        )}
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
          {obra.titulo || 'Obra sin título'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            por {obra.artist?.user?.name || 'Artista desconocido'}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-end mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Precio Final</span>
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                ${parseFloat(precio_actual).toLocaleString()}
            </span>
          </div>

          {/* Botón de Acción Principal: PAGAR */}
          <Link 
            to={`/checkout/${auction.id}`} 
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-medium rounded-lg transition-colors"
          >
            <span>💳</span>
            <span>Proceder al Pago</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WonAuctionCard;