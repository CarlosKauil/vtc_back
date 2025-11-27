
/**
 * Badge para mostrar el estado de una subasta
 * @param {string} estado - Estado de la subasta (activa, finalizada, cancelada, programada)
 */
const AuctionBadge = ({ estado }) => {
  const badges = {
    activa: {
      text: '🔴 En Vivo',
      className: 'status status--success',
    },
    finalizada: {
      text: '🔒 Finalizada',
      className: 'status status--error',
    },
    cancelada: {
      text: '❌ Cancelada',
      className: 'status status--error',
    },
    programada: {
      text: '⏰ Programada',
      className: 'status status--info',
    },
  };

  const badge = badges[estado] || badges.activa;

  return (
    <span className={`${badge.className} px-3 py-1 rounded-full text-sm font-medium`}>
      {badge.text}
    </span>
  );
};

export default AuctionBadge;
