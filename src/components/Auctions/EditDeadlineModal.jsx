import { useState } from 'react';
import auctionService from '../../api/auctionService';

/**
 * Modal para editar la hora límite de una subasta
 * Solo accesible para administradores
 * 
 * EXPLICACIÓN DETALLADA:
 * Este modal permite al administrador cambiar la fecha/hora de finalización
 * de una subasta activa. Es útil cuando necesitan extender o acortar el tiempo.
 * 
 * Props:
 * - auction: Objeto con los datos de la subasta actual
 * - onClose: Función para cerrar el modal
 * - onSuccess: Función callback que se ejecuta cuando se actualiza exitosamente
 */
const EditDeadlineModal = ({ auction, onClose, onSuccess }) => {
  // Estado para la nueva fecha (formato datetime-local: YYYY-MM-DDTHH:MM)
  const [newDeadline, setNewDeadline] = useState(() => {
    // Convertir la fecha actual de la subasta al formato del input
    const currentDate = new Date(auction.fecha_fin);
    return currentDate.toISOString().slice(0, 16);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Manejar el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar que la nueva fecha sea futura
    const selectedDate = new Date(newDeadline);
    const now = new Date();

    if (selectedDate <= now) {
      setError('La nueva fecha límite debe ser futura');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir al formato que espera el backend: YYYY-MM-DD HH:MM:SS
      const formattedDate = new Date(newDeadline)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      // Llamar al servicio para actualizar la deadline
      await auctionService.updateDeadline(auction.id, formattedDate);

      setSuccess('¡Hora límite actualizada exitosamente!');

      // Esperar 1.5 segundos y luego ejecutar el callback de éxito
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error al actualizar deadline:', err);
      setError(
        err.response?.data?.error || 
        'Error al actualizar la hora límite. Intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Calcular cuánto tiempo se agregará o quitará
   */
  const calculateTimeDifference = () => {
    const current = new Date(auction.fecha_fin);
    const selected = new Date(newDeadline);
    const diffMs = selected - current;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours === 0) return 'Sin cambios';
    if (diffHours > 0) return `+${diffHours} horas`;
    return `${diffHours} horas`;
  };

  return (
    <>
      {/* Overlay oscuro de fondo */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal centrado */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header del Modal */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏰</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Editar Hora Límite
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Subasta: {auction.obra?.titulo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Fecha Actual */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Fecha Límite Actual
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {new Date(auction.fecha_fin).toLocaleString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Nueva Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nueva Fecha y Hora Límite
              </label>
              <input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 outline-none"
                required
                disabled={isSubmitting}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                <span>📊</span>
                <span>Diferencia: <strong>{calculateTimeDifference()}</strong></span>
              </p>
            </div>

            {/* Mensajes de error/éxito */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
                <span className="text-lg flex-shrink-0">✅</span>
                <span>{success}</span>
              </div>
            )}

            {/* Advertencia */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>Este cambio afectará el tiempo restante para todas las pujas activas.</span>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Confirmar Cambio</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EditDeadlineModal;
