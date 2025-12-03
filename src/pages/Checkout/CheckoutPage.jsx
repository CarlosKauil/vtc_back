import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import auctionService from '../../api/auctionService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
    FaMusic, FaBook, FaPaintBrush, FaCube, FaLayerGroup,
    FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCreditCard
} from 'react-icons/fa';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const CheckoutPage = () => {
  useDocumentTitle('Vartica | Finalizar Compra');
  const { auctionId } = useParams();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Estados para los campos del formulario
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });
  
  const [cardType, setCardType] = useState('unknown');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await auctionService.getAuction(auctionId);
        setAuction(response.data || response);
      } catch (err) {
        console.error(err);
        setError('No pudimos cargar los detalles de la orden.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [auctionId]);

  // --- LÓGICA DE FORMATO Y DETECCIÓN ---

  // Detectar tipo de tarjeta
  const detectCardType = (number) => {
    const cleanNum = number.replace(/\D/g, '');
    if (/^4/.test(cleanNum)) return 'visa';
    if (/^5[1-5]/.test(cleanNum)) return 'mastercard';
    if (/^3[47]/.test(cleanNum)) return 'amex';
    if (/^6/.test(cleanNum)) return 'discover';
    return 'unknown';
  };

  // Formatear número con espacios (0000 0000 0000 0000)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatear fecha (MM/YY)
  const formatExpiry = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      // Eliminar espacios previos para reformatear
      const rawValue = value.replace(/\s/g, '');
      if (rawValue.length > 16) return; // Límite de 16 dígitos reales

      formattedValue = formatCardNumber(rawValue);
      setCardType(detectCardType(rawValue));
      
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
      if (formattedValue.length > 5) return; // MM/YY
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      const limit = cardType === 'amex' ? 4 : 3;
      if (formattedValue.length > limit) return;
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  // Renderizar icono de tarjeta
  const getCardIcon = () => {
    switch (cardType) {
        case 'visa': return <FaCcVisa className="text-blue-600 text-2xl" />;
        case 'mastercard': return <FaCcMastercard className="text-orange-500 text-2xl" />;
        case 'amex': return <FaCcAmex className="text-blue-400 text-2xl" />;
        case 'discover': return <FaCcDiscover className="text-orange-600 text-2xl" />;
        default: return <FaCreditCard className="text-gray-400 text-2xl" />;
    }
  };

  const getAreaConfig = (areaName) => {
    const name = areaName?.toLowerCase() || '';
    switch (name) {
        case 'musica': case 'música': return { icon: <FaMusic />, color: 'text-pink-600 bg-pink-100' };
        case 'literatura': return { icon: <FaBook />, color: 'text-blue-600 bg-blue-100' };
        case 'pintura': return { icon: <FaPaintBrush />, color: 'text-orange-600 bg-orange-100' };
        case 'modelado': case 'escultura': return { icon: <FaCube />, color: 'text-purple-600 bg-purple-100' };
        default: return { icon: <FaLayerGroup />, color: 'text-gray-600 bg-gray-100' };
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Enviamos la petición de pago al backend
      // Simulamos que enviamos el token de la tarjeta
      await auctionService.processPayment(auctionId, { 
        method: 'card',
        card_last4: cardData.number.slice(-4) 
      });
      
      setTimeout(() => {
          setSuccess(true);
          setProcessing(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Hubo un error procesando tu tarjeta. Intenta de nuevo.');
      setProcessing(false);
    }
  };

  // --- RENDERIZADO ---

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    </DashboardLayout>
  );

  const areaName = auction?.obra?.area?.nombre;
  const areaConfig = getAreaConfig(areaName);

  if (success) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[80vh]">
        <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
          <span className="text-6xl">🎉</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Pago Exitoso!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
          Felicidades, has completado la adquisición de <strong>"{auction?.obra?.nombre}"</strong>. 
          Te hemos enviado un correo con el certificado de propiedad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/auctions')} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 transition">
                Volver a Subastas
            </button>
            <button onClick={() => navigate('/auctions/won')} className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition shadow-lg flex items-center justify-center gap-2">
                <span>🏆</span> Ver mis Adquisiciones
            </button>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span>💳</span> Finalizar Compra
        </h1>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <span>⚠️</span> {error}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* FORMULARIO ADAPTADO */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-700 flex items-center gap-2">
                        Método de Pago <span className="text-sm font-normal text-gray-500">(Tarjeta de Crédito/Débito)</span>
                    </h3>
                    
                    <form onSubmit={handlePayment}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre en la tarjeta</label>
                            <input 
                                type="text" 
                                name="name"
                                value={cardData.name}
                                onChange={handleInputChange}
                                placeholder="Ej. Juan Pérez" 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                                required 
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de tarjeta</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="number"
                                    value={cardData.number}
                                    onChange={handleInputChange}
                                    placeholder="0000 0000 0000 0000" 
                                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all font-mono tracking-wider" 
                                    required 
                                />
                                <span className="absolute left-3 top-3.5">
                                    {getCardIcon()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha Exp.</label>
                                <input 
                                    type="text" 
                                    name="expiry"
                                    value={cardData.expiry}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY" 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-center tracking-wider" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVC</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        name="cvc"
                                        value={cardData.cvc}
                                        onChange={handleInputChange}
                                        placeholder="123" 
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-center tracking-wider" 
                                        required 
                                    />
                                    <span className="absolute right-3 top-3.5 text-gray-400">🔒</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mb-8 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <input type="checkbox" id="terms" className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" required />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                Acepto los términos y condiciones de la subasta.
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all shadow-md flex justify-center items-center gap-2
                                ${processing 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'
                                }`}
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Procesando pago...</span>
                                </>
                            ) : (
                                <>
                                    <span>🔒 Pagar</span>
                                    <span>${parseFloat(auction?.precio_actual).toLocaleString()}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <span className="text-lg">🛡️</span> 
                        Pagos seguros encriptados con SSL de 256-bits.
                    </p>
                </div>
            </div>

            {/* RESUMEN DE ORDEN (Con iconos de área) */}
            <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                        Resumen de la Orden
                        <span className="text-xs font-normal bg-teal-100 text-teal-800 px-2 py-1 rounded-full">#{auction?.id}</span>
                    </h3>
                    
                    {/* Item Preview */}
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                             {auction?.obra?.imagen_url ? (
                                <img src={auction.obra.imagen_url} alt="Obra" className="w-full h-full object-cover" />
                             ) : (
                                // LOGICA DE ICONO
                                <div className={`w-full h-full flex items-center justify-center text-3xl ${areaConfig.color}`}>
                                    {areaConfig.icon}
                                </div>
                             )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight mb-1">
                                {auction?.obra?.titulo}
                            </h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {auction?.obra?.artist?.alias || 'Artista'}
                            </div>
                            <div className="mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${areaConfig.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')}`}>
                                    {areaConfig.icon} {areaName || 'General'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal (Tu puja)</span>
                            <span className="font-medium text-gray-900 dark:text-gray-200">${parseFloat(auction?.precio_actual).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Comisión de Servicio (0%)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Envío Digital</span>
                            <span className="text-green-600 font-medium">Gratis</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total a Pagar</span>
                        <span className="text-2xl font-bold text-teal-600">
                            ${parseFloat(auction?.precio_actual).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;