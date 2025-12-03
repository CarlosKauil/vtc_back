import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación
import auctionService from '../api/auctionService';
import { motion, useInView } from 'framer-motion';
import { Clock, Gavel, Lock, Sparkles, TrendingUp, Infinity, Image as ImageIcon } from 'lucide-react';

const MAX_AUCTIONS = 3;

// --- Helpers & Hooks ---

// 1. Lógica robusta para obtener la URL de la imagen
// Ahora devuelve NULL si no hay imagen, para que el componente muestre el Icono
function getImageUrl(obra) {
  if (!obra) return null;
  
  const imagePath = obra.imagen || obra.archivo;
  
  if (imagePath) {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Ajusta este localhost si tu backend está en otro puerto o dominio en producción
    return `http://localhost:8000/storage/${imagePath}`;
  }
  
  return null;
}

const formatCurrency = (amount) => 
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(amount);

// Hook para cuenta regresiva
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (!targetDate) return;
    
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { 
        setTimeLeft('Finalizada'); 
        return; 
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      // Si quedan días, mostramos días y horas. Si no, horas, min y segs.
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    };
    
    calculate();
    const timer = setInterval(calculate, 1000); // Actualización cada segundo
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return timeLeft;
}

// --- Variantes de Animación ---
const liquidVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { 
    opacity: 1, y: 0, scale: 1, 
    transition: { type: "spring", stiffness: 60, damping: 15 } 
  },
  hover: { 
    y: -15, 
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// --- Subcomponente: Tarjeta de Subasta (Diseño Nuevo + Datos Reales) ---
const LiquidAuctionCard = ({ auction }) => {
  const navigate = useNavigate(); // Hook para redirección
  const timeLeft = useCountdown(auction.fecha_fin);
  const imageUrl = getImageUrl(auction.obra);
  
  // Estado local para manejar si la imagen da error al cargar
  const [imgError, setImgError] = useState(false);
  
  // Lógica segura para contar pujas (soporta total_pujas o array bids)
  const bidCount = auction.total_pujas ?? (auction.bids ? auction.bids.length : 0);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <motion.div 
      variants={liquidVariants}
      whileHover="hover"
      className="group relative w-full max-w-sm mx-auto"
    >
      {/* Fondo Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>

      {/* Tarjeta Base */}
      <div className="relative h-full bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] overflow-hidden shadow-xl flex flex-col">
        
        {/* ZONA DE IMAGEN O ICONO */}
        <div className="relative h-64 overflow-hidden p-3">
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-slate-900 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-shadow duration-500">
            
            {/* Lógica: Si hay URL y no hay error, muestra imagen. Si no, muestra Icono */}
            {imageUrl && !imgError ? (
              <img 
                src={imageUrl} 
                alt={auction.obra?.nombre || 'Subasta'}
                className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                onError={() => setImgError(true)} // Si falla la carga, activa el modo icono
              />
            ) : (
              // Fallback: Icono del área si no hay imagen
              <div className="flex flex-col items-center justify-center text-slate-600 group-hover:text-cyan-500/50 transition-colors duration-500">
                <ImageIcon className="w-16 h-16 mb-2 opacity-50" strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest opacity-40 font-['Orbitron']">Arte Digital</span>
              </div>
            )}

            {/* Gradiente superpuesto solo si hay imagen para que el texto sea legible */}
            {(imageUrl && !imgError) && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            )}
            
            {/* Badge Tiempo */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 flex items-center gap-2 shadow-lg z-10">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-[#ddfff2] font-['Orbitron']">{timeLeft}</span>
            </div>
            
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-600/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest shadow-lg z-10">
              LIVE
            </div>
          </div>
        </div>

        {/* Info Body */}
        <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-xl font-bold truncate tracking-wide font-['Orbitron'] mb-1 text-white group-hover:text-cyan-300 transition-colors">
              {auction.obra?.nombre || 'Obra Sin Nombre'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
               <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500"></div>
               <span className="truncate text-[#ddfff2]">
                 @{auction.obra?.artist?.user?.name || 'Artista desconocido'}
               </span>
            </div>
          </div>

          {/* Precio Capsule */}
          <div className="flex items-center justify-between bg-slate-900/50 rounded-2xl p-4 mb-6 border border-slate-700/50 shadow-inner">
             <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Precio Actual</p>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200 font-['Orbitron']">
                  {formatCurrency(auction.precio_actual || 0)}
                </p>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Pujas</p>
                <div className="flex items-center justify-end gap-1 text-[#ddfff2]">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="font-bold">{bidCount}</span>
                </div>
             </div>
          </div>

          {/* Botón Pujar - REDIRECCIONA AL LOGIN */}
          <button 
            onClick={handleLoginRedirect}
            className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 p-[1px] group/btn transition-transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
             <div className="relative bg-slate-900 group-hover/btn:bg-opacity-0 transition-colors duration-300 rounded-[11px] h-full">
                <div className="px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest text-cyan-400 group-hover/btn:text-white transition-colors">
                  <Gavel size={16} />
                  Pujar Ahora
                </div>
             </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Subcomponente: Slot Congelado (Placeholder) ---
const FrozenSlot = () => {
  return (
    <motion.div 
      variants={liquidVariants}
      whileHover={{ scale: 1.02, rotate: 1 }}
      className="group relative w-full max-w-sm mx-auto h-[440px]"
    >
      <div className="relative h-full w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50"></div>

        <div className="relative mb-8">
           <div className="absolute -inset-4 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute -inset-4 border border-dashed border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
           <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-600 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
             <Lock className="w-8 h-8 text-cyan-200/70" />
           </div>
           <div className="absolute top-0 right-0">
             <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
           </div>
        </div>

        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-[#ddfff2] font-['Orbitron'] mb-3">
          Bóveda Cerrada
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-[80%] mb-8">
          Una pieza exclusiva se está preparando para su revelación.
        </p>

        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md">
          <Infinity className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <span className="text-xs font-mono text-purple-200 tracking-wider">Desbloqueando...</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Componente Principal ---
export default function ActiveAuctionsPreview() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Fetch de datos idéntico al componente funcional original
  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await auctionService.getActiveAuctions();
        // Verificación de seguridad para evitar errores si la API falla
        const collection = Array.isArray(response?.data) ? response.data : [];
        setAuctions(collection.slice(0, MAX_AUCTIONS));
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  const emptySlots = MAX_AUCTIONS - auctions.length;

  return (
    <section ref={ref} className="relative w-full bg-gray-900 py-24 px-4 overflow-hidden min-h-[700px]">
      
      {/* Background Ambiental */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-['Orbitron'] font-black text-white mb-4 drop-shadow-2xl"
          >
            SUBASTAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">ACTIVAS</span>
          </motion.h2>
          
          <p className="text-[#ddfff2] max-w-xl mx-auto text-lg font-light">
            Arte en movimiento. Oferta en tiempo real.
          </p>
        </div>

        <motion.div 
          variants={{
             hidden: { opacity: 0 },
             show: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
        >
          {loading ? (
             // Skeletons de carga
             [...Array(3)].map((_, i) => (
                <div key={i} className="w-full max-w-sm h-[440px] rounded-[2rem] bg-slate-800/50 animate-pulse border border-slate-700/50"></div>
             ))
          ) : (
            <>
              {/* Renderizar subastas reales */}
              {auctions.map(auction => (
                <LiquidAuctionCard key={auction.id} auction={auction} />
              ))}
              
              {/* Rellenar espacios vacíos con Slots Congelados */}
              {[...Array(emptySlots > 0 ? emptySlots : 0)].map((_, i) => (
                 <FrozenSlot key={`frozen-${i}`} />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}