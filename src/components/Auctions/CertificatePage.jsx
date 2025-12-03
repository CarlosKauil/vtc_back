import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CertificatePage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await auctionService.getAuction(auctionId);
        setAuction(data.data || data); // Ajuste por si viene envuelto en 'data'
      } catch (error) {
        console.error("Error", error);
        navigate('/auctions/won');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auctionId, navigate]);

  if (loading) return <div className="text-center p-10">Generando documento...</div>;

  // Validación de seguridad: Si no ha pagado, no ver certificado
  if (auction?.pago_status !== 'pagado') {
    return (
        <div className="text-center p-10">
            <h2 className="text-xl text-red-600">Certificado no disponible.</h2>
            <p>Primero debes completar el pago de esta obra.</p>
            <button onClick={() => navigate(`/checkout/${auctionId}`)} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded">Ir a Pagar</button>
        </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 flex flex-col items-center">
        
        {/* Botones de Acción (No salen en la impresión) */}
        <div className="mb-8 flex gap-4 print:hidden">
            <button 
                onClick={() => navigate('/auctions/won')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
                ← Volver
            </button>
            <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition shadow-lg flex items-center gap-2"
            >
                <span>🖨️</span> Imprimir / Guardar PDF
            </button>
        </div>

        {/* EL CERTIFICADO (Diseño tipo papel) */}
        <div className="bg-white text-gray-900 w-full max-w-4xl p-10 shadow-2xl relative border-8 border-double border-gray-300 print:shadow-none print:border-4 print:w-full">
            
            {/* Marco decorativo */}
            <div className="border-2 border-teal-900 h-full p-8 flex flex-col items-center justify-between relative">
                
                {/* Fondo de marca de agua (opcional) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-9xl font-serif">KREAVERSE</span>
                </div>

                {/* Header */}
                <div className="text-center z-10">
                    <h1 className="text-5xl font-serif font-bold text-teal-900 mb-2 uppercase tracking-widest">Certificado</h1>
                    <h2 className="text-2xl font-light text-gray-600 uppercase tracking-widest">De Propiedad Digital</h2>
                </div>

                {/* Cuerpo */}
                <div className="text-center my-12 z-10 w-full">
                    <p className="text-lg text-gray-500 italic mb-4">Por medio del presente se certifica que:</p>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 inline-block px-10 pb-2">
                        {auction.ganador?.name || "Propietario Anónimo"}
                    </h3>

                    <p className="text-lg text-gray-500 italic mb-6">Es ahora el propietario legítimo de la obra titulada:</p>

                    <h2 className="text-4xl font-serif text-teal-800 font-bold mb-4">"{auction.obra?.nombre}"</h2>
                    
                    <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div>
                            <span className="block text-xs text-gray-500 uppercase">Artista Creador</span>
                            <span className="text-lg font-semibold">{auction.obra?.artist?.alias || "Artista de Kreaverse"}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 uppercase">Técnica / Formato</span>
                            <span className="text-lg font-semibold">{auction.obra?.genero_tecnica || "Arte Digital"}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 uppercase">Fecha de Adquisición</span>
                            <span className="text-lg font-semibold">
                                {auction.fecha_pago 
                                    ? format(new Date(auction.fecha_pago), 'dd ' + 'MMMM' + ' yyyy', { locale: es }) 
                                    : format(new Date(), 'dd/MM/yyyy')}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 uppercase">ID de Transacción</span>
                            <span className="text-sm font-mono text-gray-600">{auction.transaccion_id || "TRX-MANUAL"}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Firmas */}
                <div className="flex justify-between w-full mt-12 pt-8 z-10">
                    <div className="text-center">
                        <div className="w-48 border-b border-gray-400 mb-2"></div>
                        <p className="text-sm font-serif text-gray-600">Firma del Artista</p>
                    </div>
                    
                    {/* Sello */}
                    <div className="flex flex-col items-center justify-center -mt-10">
                        <div className="w-24 h-24 rounded-full border-4 border-teal-800 text-teal-800 flex items-center justify-center font-bold text-xs text-center p-2 rotate-12 opacity-80">
                            SELLO OFICIAL<br/>KREAVERSE<br/>VERIFICADO
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="w-48 border-b border-gray-400 mb-2"></div>
                        <p className="text-sm font-serif text-gray-600">CEO Kreaverse</p>
                    </div>
                </div>

                {/* Hash unico */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    <p className="text-[10px] text-gray-400 font-mono">
                        ID DOCUMENTO: {auction.id}-{Date.now().toString(36).toUpperCase()} | Este certificado es un comprobante digital.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CertificatePage;