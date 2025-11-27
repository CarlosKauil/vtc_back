import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { getObras } from '../api/obras';

import { useDocumentTitle } from '../hooks/useDocumentTitle';


// Ícono 3D de ejemplo (puedes reemplazarlo por tu librería de íconos)
const Icon3D = ({ className = "w-6 h-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 18.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 21a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 22.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM13.5 21a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM15 18.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM14.25 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0 1.5ZM13.5 1.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM15 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15.75 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM16.5 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM14.25 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
    </svg>
);


// Función para renderizar la vista previa o el ícono
const renderPreview = (obra) => {
    // 1. Obtener la extensión y la URL del Accessor
    const ext = obra.archivo ? obra.archivo.split('.').pop().toLowerCase() : '';
    const url = obra.archivo_url; 
    const isModel = ['glb', 'gltf'].includes(ext);

    let content;

    // 2. Determinar el contenido
    if (url && (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext))) {
        // Es una imagen: Muestra la vista previa
        content = (
            <img
                src={url}
                alt={obra.nombre}
                className="w-full h-24 object-cover"
            />
        );
    } else if (isModel) {
        // Es un modelo 3D: Muestra el ícono grande
        content = (
            <div className="w-full h-24 flex items-center justify-center bg-gray-200">
                <Icon3D className="w-10 h-10 text-gray-600" />
            </div>
        );
    } else if (url && (['mp3', 'wav'].includes(ext))) {
        // Es audio: Muestra un ícono de audio
        content = (
            <div className="w-full h-24 flex items-center justify-center bg-gray-200">
                <span className="text-gray-600 text-sm font-semibold">
                    🎵 {obra.area?.nombre || 'Audio'}
                </span>
            </div>
        );
    } else {
        // Es cualquier otro archivo (PDF, Video, etc.)
        content = (
            <div className="w-full h-24 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-sm">
                    {obra.area?.nombre || 'Archivo'}
                </span>
            </div>
        );
    }

    // 3. Devolver el contenido con el icono 3D en la esquina superior derecha si aplica
    return (
        <div className="relative">
            {content}
            {isModel && (
                <div 
                    title="Obra de Modelado 3D"
                    className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-70 rounded-full text-white"
                >
                    <Icon3D className="w-4 h-4" />
                </div>
            )}
        </div>
    );
};


export default function MisObrasContainer() {
    useDocumentTitle("Vartica | Mis Obras");
    const [obras, setObras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getObras() 
            .then(setObras)
            .catch(() => setError('Error al cargar las obras'))
            .finally(() => setLoading(false));
    }, []);

    const getEstatusClasses = (estatusNombre) => {
        switch (estatusNombre) {
            case 'Aceptada':
                return 'bg-green-100 text-green-700';
            case 'Rechazada':
                return 'bg-red-100 text-red-700 font-bold'; // Más énfasis en Rechazada
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };
    
    // Función para truncar la descripción
    const truncateDescription = (text, limit) => {
        if (!text) return '';
        if (text.length <= limit) return text;
        return text.substring(0, limit) + '...';
    };

    return (
        
        <DashboardLayout>
            <div className="bg-gray-100 min-h-screen px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-2 text-gray-900">Mis Obras</h2>
                    <Link
                        to="/create-obras"
                        className="inline-block bg-gray-900 text-white font-semibold px-5 py-2 rounded mb-6 shadow hover:bg-gray-700 transition"
                    >
                        + Agregar
                    </Link>
                    {loading ? (
                        <div className="text-center text-gray-500 py-12">Cargando obras...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-12">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                            {obras.map((obra, idx) => (
                                <div
                                    key={obra.id || idx}
                                    className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
                                    style={{ minHeight: 230 }}
                                >
                                    
                                    {/* Vista Previa */}
                                    {obra.archivo && renderPreview(obra)}

                                    <div className="p-4">
                                        <div className='flex justify-between items-start mb-2'>
                                            <h3 className="text-xl font-bold text-gray-900 leading-snug">{obra.nombre}</h3>
                                            
                                            {/* Badge de Área */}
                                            {obra.area?.nombre && (
                                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full whitespace-nowrap">
                                                    {obra.area.nombre}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Descripción Truncada */}
                                        <p className="text-gray-600 mb-3 text-sm h-10 overflow-hidden">
                                            {truncateDescription(obra.descripcion || 'Sin descripción.', 75)}
                                        </p>
                                        
                                        {/* Estatus y Mensaje de Rechazo */}
                                        <div className="text-sm font-semibold mt-3">
                                            <span 
                                                className={`px-3 py-1 rounded-full text-xs uppercase ${getEstatusClasses(obra.estatus?.nombre)}`}
                                            >
                                                {obra.estatus?.nombre || 'Desconocido'}
                                            </span>

                                            {obra.estatus?.nombre === 'Rechazada' && obra.mensajesRechazo && obra.mensajesRechazo.length > 0 && (
                                                <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs italic'>
                                                    {truncateDescription(obra.mensajesRechazo[0].mensaje, 50)}
                                                    <span className='font-bold ml-1'>
                                                        (Motivo)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {obras.length === 0 && (
                                <div className="col-span-full text-center text-gray-400 text-3xl py-12">
                                    No hay obras registradas. ¡Anímate a subir la primera!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}