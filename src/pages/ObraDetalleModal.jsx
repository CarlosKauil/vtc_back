export default function ObraDetalleModal({ obra, onClose }) {
    if (!obra) return null;

    // Desestructuramos el objeto. 'archivo_url' es el Accessor que generamos en el modelo Laravel.
    const { 
        nombre, 
        descripcion, 
        anio_creacion, 
        genero_tecnica, 
        estatus, 
        artist, // Relación artist (incluye alias)
        archivo_url, // URL pública completa (ej: http://localhost:8000/storage/obras/...)
        archivo // Ruta relativa (ej: obras/musica/file.wav)
    } = obra;

    // Usamos la URL generada por el Accessor de Laravel como principal.
    // Incluimos un fallback por si 'archivo_url' no se ha cargado por alguna razón.
    const finalArchivoUrl = archivo_url || `https://backend-z57u.onrender.com/storage/${archivo}`; 

    // Obtenemos la extensión del archivo a partir de la ruta relativa para la previsualización.
    const ext = archivo ? archivo.split('.').pop().toLowerCase() : '';

    const renderArchivo = () => {
        
        if (!finalArchivoUrl) {
            return <p className="text-center text-gray-500">Ruta de archivo no disponible.</p>;
        }
        
        // Archivos de imagen comunes
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
            return <img src={finalArchivoUrl} alt={nombre} className="max-w-full max-h-96 mx-auto rounded-md shadow-md" />;
        } 
        
        // Archivos de modelado 3D (no se previsualizan fácilmente en React estándar, mostramos enlace)
        if (['glb', 'gltf'].includes(ext)) {
            return (
                 <p className="text-center text-gray-500">
                    Archivo de Modelado 3D (.{ext}). No se puede previsualizar directamente.
                    <br />
                    <a
                        href={finalArchivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Descargar archivo
                    </a>
                </p>
            );
        }
        
        // Archivos de video
        if (['mp4', 'webm', 'ogg'].includes(ext)) {
            return (
                <video controls className="max-w-full max-h-96 mx-auto rounded-md shadow-md">
                    <source src={finalArchivoUrl} type={`video/${ext}`} />
                    Tu navegador no soporta video.
                </video>
            );
        } 
        
        // Archivos de audio
        if (['mp3', 'wav'].includes(ext)) {
            return (
                <audio controls className="w-full mx-auto">
                    <source src={finalArchivoUrl} type={`audio/${ext}`} />
                    Tu navegador no soporta audio.
                </audio>
            );
        } 
        
        // Cualquier otro tipo de archivo (e.g., PDF, DOCX, ZIP)
        return (
            <p className="text-center text-gray-500">
                Este archivo (.{ext}) no puede previsualizarse.
                <br />
                <a
                    href={finalArchivoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    Descargar archivo
                </a>
            </p>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow"
                    title="Cerrar"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">{nombre}</h2>
                
                {/* Muestra el Alias del Artista y su Nombre real (usando artist.user) */}
                <p className="mb-2 text-gray-900">
                    <strong className="text-black">Artista (Alias):</strong> {artist?.alias || 'N/A'}
                </p>
                <p className="mb-2 text-gray-900">
                    <strong className="text-black">Nombre real:</strong> {artist?.user?.name || 'Desconocido'}
                </p>

                <p className="mb-2 text-gray-900"><strong className="text-black">Año de creación:</strong> {anio_creacion}</p>
                <p className="mb-2 text-gray-900"><strong className="text-black">Técnica/Género:</strong> {genero_tecnica || 'N/A'}</p>
                <p className="mb-2 text-gray-900"><strong className="text-black">Estatus:</strong> {estatus?.nombre}</p>
                {descripcion && <p className="mb-4 text-black"><strong className="text-black">Descripción:</strong> {descripcion}</p>}

                <div className="border rounded p-4 bg-gray-50">
                    {renderArchivo()}
                </div>
            </div>
        </div>
    );
}