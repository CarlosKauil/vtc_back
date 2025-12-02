import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auctionService from '../../api/auctionService';
import axios from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const CreateAuction = () => {
  const navigate = useNavigate();

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    obra_id: '',
    precio_inicial: '',
    incremento_minimo: '100.00',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const [obras, setObras] = useState([]);
  const [loadingObras, setLoadingObras] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
// Función helper para obtener la fecha/hora actual en formato datetime-local
    const getCurrentDateTime = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5); // Agregar 5 minutos de margen
      return now.toISOString().slice(0, 16);
    };



  // Cargar obras aceptadas/subastables
  useEffect(() => {
    loadObrasAceptadas();
  }, []);

  const obrasFiltradas = obras.filter(
    (obra) =>
      Number(obra.estatus_id) === 2 && Number(obra.es_subastable) === 1
  );

  // Limpiar selección de obra si ya no es válida
  useEffect(() => {
    if (
      formData.obra_id &&
      !obrasFiltradas.some((o) => o.id === parseInt(formData.obra_id))
    ) {
      setFormData((prev) => ({ ...prev, obra_id: '' }));
    }
  }, [obras]);

  const loadObrasAceptadas = async () => {
    try {
      setLoadingObras(true);
      const response = await axios.get('/obras/aceptadas');
      setObras(response.data);
    } catch (err) {
      console.error('Error al cargar obras:', err);
      setError('Error al cargar las obras disponibles.');
    } finally {
      setLoadingObras(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.obra_id) {
      setError('Debes seleccionar una obra');
      return;
    }

    if (parseFloat(formData.precio_inicial) <= 0) {
      setError('El precio inicial debe ser mayor a 0');
      return;
    }

    if (parseFloat(formData.incremento_minimo) <= 0) {
      setError('El incremento mínimo debe ser mayor a 0');
      return;
    }

    if (!formData.fecha_inicio || !formData.fecha_fin) {
      setError('Debes elegir fecha y hora de inicio y fin');
      return;
    }

    if (new Date(formData.fecha_inicio) <= new Date()) {
      setError('La subasta debe iniciar en una fecha/hora futura');
      return;
    }

    if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
      setError('La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    setIsSubmitting(true);

    

    try {
      // Payload limpio y adaptado a tu backend
      const payload = {
        obra_id: parseInt(formData.obra_id),
        precio_inicial: parseFloat(formData.precio_inicial),
        incremento_minimo: parseFloat(formData.incremento_minimo),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
      };

      await auctionService.createAuction(payload);

      setSuccess('¡Subasta creada exitosamente!');

      setTimeout(() => {
        navigate('/auctions');
      }, 2000);
    } catch (err) {
      console.error('Error al crear subasta:', err);
      setError(
        err.response?.data?.error || 'Error al crear la subasta. Intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers de archivo/preview (¡funciones no corrompidas!)
  const getFileType = (filePath) => {
    if (!filePath) return 'unknown';
    const ext = filePath.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext))
      return 'image';
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext)) return 'audio';
    if (['glb', 'gltf', 'obj', 'fbx', 'stl', '3ds'].includes(ext)) return '3d';
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
    return 'unknown';
  };

  const getFileUrl = (obra) => {
    if (!obra) return null;
    const filePath = obra.imagen || obra.archivo;
    if (filePath) {
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath;
      }
      return `http://localhost:8000/storage/${filePath}`;
    }
    return null;
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'audio':
        return '🎵';
      case '3d':
        return '🎲';
      case 'video':
        return '🎬';
      default:
        return '📄';
    }
  };

  const renderPreview = (obra) => {
    const fileUrl = getFileUrl(obra);
    const filePath = obra.imagen || obra.archivo;
    const fileType = getFileType(filePath);

    if (!fileUrl) {
      return (
        <div className="relative h-60 rounded-lg overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-4xl mb-2">📄</p>
            <p className="text-sm">Sin archivo</p>
          </div>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="relative h-60 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700">
            <img
              src={fileUrl}
              alt={obra.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=Error+al+cargar';
              }}
            />
            <span className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-teal-600 dark:text-teal-400">
              🖼️ Imagen
            </span>
          </div>
        );
      case 'audio':
        return (
          <div className="relative h-60 rounded-lg overflow-hidden bg-gradient-to-br from-pink-500 to-rose-700 flex flex-col items-center justify-center p-6">
            <div className="text-center text-white mb-4">
              <p className="text-6xl mb-3">🎵</p>
              <p className="text-sm font-semibold">Archivo de Audio</p>
            </div>
            <audio controls className="w-full" src={fileUrl}>
              Tu navegador no soporta el elemento de audio.
            </audio>
            <span className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-pink-600 dark:text-pink-400">
              🎵 Audio
            </span>
          </div>
        );
      case '3d':
        return (
          <div className="relative h-60 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-700 flex flex-col items-center justify-center p-6">
            <div className="text-center text-white">
              <p className="text-6xl mb-3">🎲</p>
              <p className="text-sm font-semibold mb-2">Modelo 3D</p>
              <p className="text-xs opacity-80">
                {filePath.split('.').pop().toUpperCase()}
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
              >
                Ver modelo →
              </a>
            </div>
            <span className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              🎲 3D
            </span>
          </div>
        );
      case 'video':
        return (
          <div className="relative h-60 rounded-lg overflow-hidden bg-black">
            <video
              controls
              className="w-full h-full object-cover"
              src={fileUrl}
            >
              Tu navegador no soporta el elemento de video.
            </video>
            <span className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-purple-600 dark:text-purple-400">
              🎬 Video
            </span>
          </div>
        );
      default:
        return (
          <div className="relative h-60 rounded-lg overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-4xl mb-2">📄</p>
              <p className="text-sm">Formato no soportado</p>
              <p className="text-xs opacity-80 mt-1">
                {filePath.split('.').pop().toUpperCase()}
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
              >
                Descargar archivo →
              </a>
            </div>
          </div>
        );
    }
  };

  const obraSeleccionada = obras.find(
    (obra) => obra.id === parseInt(formData.obra_id)
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="mb-8">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 transition-all duration-200 hover:gap-2"
          >
            <span>←</span>
            <span>Volver a Subastas</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <span className="text-4xl">➕</span>
            <span className="text-black">Crear Nueva Subasta</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configura una nueva subasta para una obra aprobada y subastable
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selecciona obra */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    <span className="text-base">🎨</span>
                    <span>Obra a Subastar</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {loadingObras ? (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-3">
                      <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full"></div>
                      <span>Cargando obras...</span>
                    </div>
                  ) : obrasFiltradas.length === 0 ? (
                    <p className="text-red-500 py-2">
                      No hay obras aceptadas y subastables disponibles
                    </p>
                  ) : (
                    <select
                      name="obra_id"
                      value={formData.obra_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 outline-none cursor-pointer"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">-- Selecciona una obra --</option>
                      {obrasFiltradas.map((obra) => {
                        const artistaNombre =
                          obra.artist?.user?.name ||
                          obra.user?.name ||
                          'Artista desconocido';
                        const areaNombre =
                          obra.area_nombre || obra.area?.nombre || 'Sin área';
                        const filePath = obra.imagen || obra.archivo;
                        const fileType = getFileType(filePath);
                        const fileIcon = getFileIcon(fileType);
                        return (
                          <option key={obra.id} value={obra.id}>
                            {fileIcon} {obra.nombre} - {artistaNombre} (
                            {areaNombre})
                          </option>
                        );
                      })}
                    </select>
                  )}
                  <p className="flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>ℹ️</span>
                    <span>Solo se muestran obras aceptadas y subastables</span>
                  </p>
                </div>

                {/* Precio inicial */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    <span className="text-base">💰</span>
                    <span>Precio Inicial (MX)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio_inicial"
                      value={formData.precio_inicial}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="1000.00"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 outline-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>📊</span>
                    <span>El precio desde el cual iniciará la subasta</span>
                  </p>
                </div>

                {/* Incremento mínimo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    <span className="text-base">📈</span>
                    <span>Incremento Mínimo (MX)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
                      +$
                    </span>
                    <input
                      type="number"
                      name="incremento_minimo"
                      value={formData.incremento_minimo}
                      onChange={handleChange}
                      step="0.01"
                      min="1"
                      placeholder="100.00"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 outline-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="flex items-start gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>⬆️</span>
                    <span>
                      Cada puja debe superar la anterior por al menos esta cantidad
                    </span>
                  </p>
                </div>

                {/* Fecha/hora de inicio */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    <span className="text-base">⏰</span>
                    <span>Fecha y hora de inicio</span>
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                      📅
                    </span>

                    <input
                      type="datetime-local"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      required
                      min={getCurrentDateTime()}
                      disabled={isSubmitting}
                      className="
                        w-full pl-12 pr-4 py-3
                        border-2 border-gray-300 dark:border-gray-600 rounded-lg
                        bg-white dark:bg-gray-700
                        text-gray-900 dark:text-gray-100
                        focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
                        transition-all duration-200 outline-none
                      "
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    <span className="text-base">⏳</span>
                    <span>Fecha y hora de fin</span>
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                      📅
                    </span>

                    <input
                      type="datetime-local"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleChange}
                      required
                      min={formData.fecha_inicio || new Date().toISOString().slice(0, 16)}
                      disabled={isSubmitting}
                      className="
                        w-full pl-12 pr-4 py-3
                        border-2 border-gray-300 dark:border-gray-600 rounded-lg
                        bg-white dark:bg-gray-700
                        text-gray-900 dark:text-gray-100
                        focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
                        transition-all duration-200 outline-none
                      "
                    />
                  </div>
                </div>

                {/* Mensajes de error/éxito */}
                {error && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div className="flex-1">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg">
                    <span className="text-xl flex-shrink-0">✅</span>
                    <div className="flex-1">
                      <div>{success}</div>
                      <p className="text-sm mt-2">
                        Redirigiendo a subastas...
                      </p>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || loadingObras || obrasFiltradas.length === 0
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span>Creando Subasta...</span>
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        <span>Crear Subasta</span>
                      </>
                    )}
                  </button>

                  <Link to="/auctions" className="flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </Link>
                </div>

                  
                </div>
              </form>
            </div>
          </div>
          {/* Preview de la obra seleccionada */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                <span>👁️</span>
                <span>Vista Previa</span>
              </h3>
              {obraSeleccionada ? (
                <div className="space-y-4">
                  {renderPreview(obraSeleccionada)}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {obraSeleccionada.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      por{' '}
                      <span className="font-semibold">
                        {obraSeleccionada.artist?.user?.name ||
                          obraSeleccionada.user?.name ||
                          'Artista desconocido'}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md mt-2">
                      <span>🎨</span>
                      <span>
                        {obraSeleccionada.area_nombre ||
                          obraSeleccionada.area?.nombre ||
                          'Sin área'}
                      </span>
                    </span>
                  </div>
                  {obraSeleccionada.descripcion && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {obraSeleccionada.descripcion}
                    </div>
                  )}
                  {formData.precio_inicial && (
                    <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Precio Inicial:
                        </span>
                        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          ${parseFloat(formData.precio_inicial).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Incremento:
                        </span>
                        <span className="text-base font-semibold text-amber-600 dark:text-amber-500">
                          +${parseFloat(formData.incremento_minimo || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Fecha de inicio:
                        </span>
                        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {formData.fecha_inicio
                            ? new Date(formData.fecha_inicio).toLocaleString('es-MX', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'No definida'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Fecha de fin:
                        </span>
                        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {formData.fecha_fin
                            ? new Date(formData.fecha_fin).toLocaleString('es-MX', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'No definida'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Mínima 1ra Puja:
                        </span>
                        <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                          {(
                            parseFloat(formData.precio_inicial || 0) +
                            parseFloat(formData.incremento_minimo || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-6xl mb-3 opacity-50">🎨</p>
                  <p className="text-sm">Selecciona una obra para ver la vista previa</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAuction;
