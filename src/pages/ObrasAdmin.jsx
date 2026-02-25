import { useEffect, useState } from 'react';
import { getObras, actualizarObra, deleteObra } from '../api/obras'; 
import DashboardLayout from '../layouts/DashboardLayout';
import ObraDetalleModal from './ObraDetalleModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';



// --- Constantes para la paginación ---
const OBRAS_POR_PAGINA = 10;


export default function ObrasAdmin() {
    useDocumentTitle("Vartica | Administración de Obras");
    const [obras, setObras] = useState([]);
    const [msg, setMsg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [obraRechazoId, setObraRechazoId] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [loading, setLoading] = useState(false);
    const [filtroEstatus, setFiltroEstatus] = useState(null);
    const [obraSeleccionada, setObraSeleccionada] = useState(null);


    // --- Lógica de Paginación ---
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(obras.length / OBRAS_POR_PAGINA);


    const inicio = (paginaActual - 1) * OBRAS_POR_PAGINA;
    const fin = inicio + OBRAS_POR_PAGINA;
    const obrasPaginadas = obras.slice(inicio, fin);


    useEffect(() => {
        setPaginaActual(1);
        fetchObras(filtroEstatus);
    }, [filtroEstatus]);


    useEffect(() => {
        if (paginaActual > totalPaginas && totalPaginas > 0) {
            setPaginaActual(totalPaginas);
        }
    }, [obras.length, totalPaginas]);


    // Obtener las obras desde la API según el filtro actual
    const fetchObras = async (estatusId) => {
        setLoading(true);
        try {
            const data = await getObras(estatusId);
            
            // CORRECCIÓN: Ordenar descendente por ID (Más reciente primero)
            if (Array.isArray(data)) {
                // b.id - a.id pone los IDs más altos primero
                const obrasOrdenadas = [...data].sort((a, b) => b.id - a.id);
                setObras(obrasOrdenadas);
            } else {
                setObras([]);
            }
        } catch (error) {
            console.error('Error al cargar obras:', error);
            setObras([]);
        } finally {
            setLoading(false);
        }
    };


    const handleVerArchivo = (obra) => {
        setObraSeleccionada(obra);
    };


    const handleCerrarModalObra = () => {
        setObraSeleccionada(null);
    };


    const handleAceptar = async (id) => {
        try {
            await actualizarObra(id, { estatus_id: 2 });
            setMsg('Obra aceptada con éxito.');
            fetchObras(filtroEstatus);
        } catch (error) {
            console.error('Error al aceptar obra:', error);
            setMsg('Error al aceptar la obra.');
        }
    };


    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la obra "${nombre}"? Esta acción es irreversible.`)) {
            try {
                await deleteObra(id);
                setMsg(`Obra "${nombre}" eliminada correctamente.`);
                fetchObras(filtroEstatus);
            } catch (error) {
                console.error('Error al eliminar obra:', error);
                setMsg('Error al eliminar la obra. Verifica permisos o estado.');
            }
        }
    };


    const handleAbrirModal = (id) => {
        setObraRechazoId(id);
        setMotivoRechazo('');
        setShowModal(true);
    };


    const handleEnviarRechazo = async () => {
        if (!motivoRechazo.trim()) return;
        try {
            await actualizarObra(obraRechazoId, {
                estatus_id: 3,
                mensaje_rechazo: motivoRechazo,
            });
            setMsg('Obra rechazada y mensaje enviado.');
            setShowModal(false);
            setObraRechazoId(null);
            setMotivoRechazo('');
            fetchObras(filtroEstatus);
        } catch (error) {
            console.error('Error al rechazar obra:', error);
            setMsg('Error al rechazar la obra.');
        }
    };


    const handleCerrarModal = () => {
        setShowModal(false);
        setObraRechazoId(null);
        setMotivoRechazo('');
    };
    
    const isAcceptedView = filtroEstatus === 2;


    return (
        <DashboardLayout>
            <div className="bg-white rounded-xl  mt-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Administración de Obras</h2>
                {msg && (
                    <p 
                      className={`mb-4 p-2 rounded text-sm font-semibold ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                        {msg}
                    </p>
                )}


                {/* Filtros por estatus */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setFiltroEstatus(null)}
                        className={`px-4 py-2 rounded-lg font-semibold m-1 transition-colors duration-150 ${
                            filtroEstatus === null ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFiltroEstatus(1)}
                        className={`px-4 py-2 rounded-lg font-semibold m-1 transition-colors duration-150 ${
                            filtroEstatus === 1 ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFiltroEstatus(2)}
                        className={`px-4 py-2 rounded-lg font-semibold m-1 transition-colors duration-150 ${
                            filtroEstatus === 2 ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Aceptadas
                    </button>
                    <button
                        onClick={() => setFiltroEstatus(3)}
                        className={`px-4 py-2 rounded-lg font-semibold m-1 transition-colors duration-150 ${
                            filtroEstatus === 3 ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Rechazadas
                    </button>
                </div>


                {loading ? (
                    <p className="text-center text-gray-500 py-8">Cargando obras...</p>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Artista
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Área
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Nombre de la Obra
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Estatus
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Archivo
                                    </th>
                                    {!isAcceptedView && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    )}
                                    {!isAcceptedView && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            Motivo de rechazo
                                        </th>
                                    )}
                                    {filtroEstatus !== 3 && ( 
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                            Eliminar
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {obrasPaginadas.map((obra) => (
                                    <tr key={obra.id} className="hover:bg-gray-50 transition-colors">
                                        
                                        {/* Artista */}
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                            <p className="text-sm text-black uppercase">{obra.artist?.user?.name || obra.user?.name || 'Usuario Desconocido'}</p>
                                        </td>

                                        {/* Nombre del área */}
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            {obra.area_nombre || obra.area?.nombre || 'Sin área'}
                                        </td>

                                        {/* Nombre de la obra */}
                                        <td className="px-4 py-2 text-sm text-gray-600">{obra.nombre}</td>

                                        {/* Estatus */}
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                                    obra.estatus.nombre === 'Pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : obra.estatus.nombre === 'Aceptada'
                                                        ? 'bg-green-100 text-green-800'
                                                        : obra.estatus.nombre === 'Rechazada'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {obra.estatus.nombre}
                                            </span>
                                        </td>

                                        {/* Ver archivo */}
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleVerArchivo(obra)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                            >
                                                Ver archivo
                                            </button>
                                        </td>

                                        {/* Acciones (Aceptar / Rechazar) */}
                                        {!isAcceptedView && (
                                            <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                                                {obra.estatus.nombre === 'Pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAceptar(obra.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                                            title="Aceptar obra"
                                                        >
                                                            Aceptar
                                                        </button>
                                                        <button
                                                            onClick={() => handleAbrirModal(obra.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                                            title="Rechazar obra"
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}

                                        {/* Motivo rechazo */}
                                        {!isAcceptedView && (
                                            <td className="px-4 py-2 text-sm text-gray-600 max-w-xs">
                                                {obra.estatus.nombre === 'Rechazada' ? (
                                                    obra.mensajes_rechazo?.length > 0 || obra.mensajesRechazo?.length > 0 ? (
                                                        <span 
                                                            title={(obra.mensajes_rechazo?.[0]?.mensaje || obra.mensajesRechazo?.[0]?.mensaje)} 
                                                            className="text-red-700 block truncate"
                                                        >
                                                            {obra.mensajes_rechazo?.[0]?.mensaje || obra.mensajesRechazo?.[0]?.mensaje}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">
                                                            No hay mensaje
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        
                                        {/* Botón de Eliminación */}
                                        {filtroEstatus !== 3 && (
                                            <td className="px-4 py-2">
                                                {obra.estatus.nombre === 'Aceptada' && (
                                                    <button
                                                        onClick={() => handleEliminar(obra.id, obra.nombre)}
                                                        className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded text-xs font-semibold transition shadow-md"
                                                        title={`Eliminar obra ${obra.nombre}`}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </td>
                                        )}

                                    </tr>
                                ))}
                                {obrasPaginadas.length === 0 && obras.length > 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-gray-400 py-4">
                                            No hay más obras en esta página.
                                        </td>
                                    </tr>
                                )}
                                {obras.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-gray-400 py-6">
                                            No hay obras para este estatus.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}


                {/* --- CONTROLES DE PAGINACIÓN --- */}
                {obras.length > OBRAS_POR_PAGINA && (
                    <div className="flex justify-between items-center mt-6 p-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                            Página {paginaActual} de {totalPaginas}
                        </span>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setPaginaActual(prev => prev - 1)}
                                disabled={paginaActual === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPaginaActual(prev => prev + 1)}
                                disabled={paginaActual === totalPaginas}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* Modal para motivo de rechazo con efecto blur */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-[scale-in_0.2s_ease-out]">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Motivo de rechazo</h3>
                        <textarea
                            className="w-full border border-gray-300 text-gray-700 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                            rows={4}
                            placeholder="Escribe el motivo del rechazo..."
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCerrarModal}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEnviarRechazo}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!motivoRechazo.trim()}
                            >
                                Enviar rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal de detalles de obra */}
            {obraSeleccionada && (
                <ObraDetalleModal obra={obraSeleccionada} onClose={handleCerrarModalObra} />
            )}
        </DashboardLayout>
    );
}
