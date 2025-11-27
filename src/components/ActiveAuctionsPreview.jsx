import { useEffect, useState, useRef } from 'react';
import auctionService from '../api/auctionService';
import { useInView } from 'framer-motion';
import 'animate.css';

const MAX_AUCTIONS = 3;

function getImageUrl(obra) {
  if (!obra) return 'https://via.placeholder.com/600x800?text=Sin+Imagen';
  const imagePath = obra.imagen || obra.archivo;
  if (imagePath) {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:8000/storage/${imagePath}`;
  }
  return 'https://via.placeholder.com/600x800?text=Sin+Imagen';
}

function getRemainingTime(fechaFin) {
  const diff = (new Date(fechaFin) - new Date());
  if (diff <= 0) return 'Finalizada';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

// Card con animación solo al entrar al viewport
function AnimatedCard({ children }) {
  const ref = useRef();
  const inView = useInView(ref, { amount: 0.2, once: false });
  return (
    <div
      ref={ref}
      className={`rounded-3xl min-h-[340px] w-full md:w-[340px] max-w-xs
        transition-all duration-300
        bg-gradient-to-br from-[#18253a] to-[#13203b] shadow-xl
        ${inView ? 'animate__backInRight animate__zoomInLeft': ''}
        hover:scale-105 hover:shadow-2xl`}
      style={{ animationDuration: inView ? "1.2s" : undefined }}
    >
      {children}
    </div>
  );
}

export default function ActiveAuctionsPreview() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await auctionService.getActiveAuctions();
        const collection = Array.isArray(response?.data) ? response.data : [];
        setAuctions(collection.slice(0, MAX_AUCTIONS));
      } catch {
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  useEffect(() => {
    const updateTimers = () => {
      setTimers(auctions.map(a => getRemainingTime(a.fecha_fin)));
    };
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  let cardsList;
  if (loading) {
    cardsList = [...Array(3)].map((_, i) => (
      <AnimatedCard key={i}>
        <div className="flex items-center justify-center h-full">
          <div className="w-14 h-14 rounded-full bg-cyan-700 opacity-40"></div>
        </div>
      </AnimatedCard>
    ));
  } else {
    cardsList = auctions.map((auction, idx) => (
      <AnimatedCard key={auction.id}>
        <div className="relative flex flex-col items-center justify-between min-h-[340px] px-5 pt-8 pb-4 w-full h-full">
          <div className="mt-3 mb-3 flex justify-center w-full">
            <img
              src={getImageUrl(auction.obra)}
              alt={auction.obra?.nombre || 'Sin imagen'}
              className="h-16 w-16 rounded-full border-4 border-cyan-400 shadow-md object-cover bg-black"
              onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Sin+Imagen'; }}
            />
          </div>
          <h3 className="font-orbitron text-xl md:text-2xl font-extrabold text-cyan-200 mb-1 text-center">
            {auction.obra?.nombre || 'Sin nombre'}
          </h3>
          {auction.obra?.artist?.user?.name &&
            <p className="text-sm text-cyan-400 font-semibold text-center mb-1">Por: {auction.obra.artist.user.name}</p>
          }
          <span className="mt-1 mb-2 inline-block px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-bold">
            Estado: <span className="capitalize">{auction.estado || 'Activo'}</span>
          </span>
          <div className="flex justify-center gap-6 text-xs font-bold mb-1">
            <div>
              <span className="block text-orange-400">Inicio</span>
              <span className="block text-white">{auction.fecha_inicio ? new Date(auction.fecha_inicio).toLocaleDateString() : '--'}</span>
            </div>
            <div>
              <span className="block text-orange-400">Fin</span>
              <span className="block text-white">{auction.fecha_fin ? new Date(auction.fecha_fin).toLocaleDateString() : '--'}</span>
            </div>
          </div>
          <div className="mb-2">
            <span className="text-lime-400 font-extrabold">Pujas: </span>
            <span className="font-bold text-white">{auction.total_pujas ?? (auction.bids ? auction.bids.length : 0)}</span>
          </div>
          <div className="mb-2">
            <span className="block text-cyan-400 text-xs">PRECIO ACTUAL</span>
            <span className="font-orbitron text-3xl font-bold text-pink-400">
              {auction.precio_actual !== undefined && auction.precio_actual !== null
                ? `$${Number(auction.precio_actual).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                : '--'}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-orbitron text-cyan-300 font-semibold text-lg">{timers[idx] || getRemainingTime(auction.fecha_fin)}</span>
          </div>
          <button className="mt-2 bg-cyan-700 text-white font-orbitron text-lg px-8 py-2 rounded-full shadow-md border-2 border-cyan-400 font-extrabold uppercase hover:bg-cyan-500">
            PUJAR
          </button>
        </div>
      </AnimatedCard>
    ));
    let numPlaceholders = 3 - cardsList.length;
    for (let i = 0; i < numPlaceholders; i++) {
      cardsList.push(
        <AnimatedCard key={`ph-${i}`}>
          <div className="flex flex-col items-center justify-center h-full min-h-[340px]">
            <span className="font-orbitron text-cyan-300 text-xl mb-2">Próximamente</span>
            <div className="w-14 h-14 bg-cyan-700 opacity-10 rounded-full"></div>
          </div>
        </AnimatedCard>
      );
    }
  }

  return (
    <section className="relative w-full bg-gradient-to-br from-[#101623] via-[#203d5e] to-[#162235] py-12 text-center min-h-[450px] overflow-hidden">
      <h2 className="relative z-10 text-4xl md:text-5xl font-orbitron font-extrabold text-cyan-300 tracking-wide drop-shadow-lg mb-10">
        SUBASTAS ACTIVAS
      </h2>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 place-items-center gap-8 w-full">
        {cardsList}
      </div>
    </section>
  );
}
