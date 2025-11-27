// src/components/Auctions/Countdown.jsx
import { useState, useEffect } from 'react';

/**
 * Componente de countdown en tiempo real
 * Muestra días, horas, minutos y segundos restantes
 */
const Countdown = ({ fechaFin, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(fechaFin);
      const diff = Math.max(0, Math.floor((end - now) / 1000)); // Segundos restantes

      if (diff === 0 && onExpire) {
        onExpire(); // Callback cuando expira
      }

      return diff;
    };

    // Calcular inmediatamente
    setTimeLeft(calculateTimeLeft());

    // Actualizar cada segundo
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [fechaFin, onExpire]);

  // Formatear segundos a días, horas, minutos, segundos
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return { days, hours, mins, secs };
  };

  if (timeLeft === null) {
    return <span className="text-gray-400">Cargando...</span>;
  }

  if (timeLeft === 0) {
    return (
      <div className="text-red-500 font-bold">
        ⏰ Subasta Finalizada
      </div>
    );
  }

  const { days, hours, mins, secs } = formatTime(timeLeft);

  return (
    <div className="flex gap-2 items-center">
      {/* Días */}
      {days > 0 && (
        <div className="flex flex-col items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
            {days}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {days === 1 ? 'Día' : 'Días'}
          </span>
        </div>
      )}

      {/* Horas */}
      <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-md">
        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {hours.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Hrs</span>
      </div>

      <span className="text-2xl font-bold text-gray-400">:</span>

      {/* Minutos */}
      <div className="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-md">
        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {mins.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Min</span>
      </div>

      <span className="text-2xl font-bold text-gray-400">:</span>

      {/* Segundos */}
      <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md">
        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
          {secs.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Seg</span>
      </div>
    </div>
  );
};

export default Countdown;
