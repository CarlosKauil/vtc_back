import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfile } from '../api/profile'; // Asegúrate que la ruta sea correcta
import Navbar from '../components/Navbar';
import { Velustro } from "uvcanvas";
import { motion } from "framer-motion";
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Footer from '../components/Footer';


// --- Constantes y Helpers ---
// Imagen genérica artística (Abstracta/Creativa) para cuando no hay avatar
const DEFAULT_ARTIST_AVATAR = "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=200&auto=format&fit=crop";

// Generador de iniciales como fallback secundario
const getInitialsAvatar = (name) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256`;

// --- Componente ObraCard (Mejorado) ---
const ObraCard = ({ obra }) => {
  const isImage = obra.archivo_url && 
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(obra.archivo.split('.').pop().toLowerCase());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Contenedor de Imagen con Ratio Aspecto */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {isImage ? (
          <div className="w-full h-full overflow-hidden">
            <img
              src={obra.archivo_url}
              alt={obra.nombre}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-gray-400 p-6">
            <span className="text-5xl mb-3 opacity-50">🎨</span>
            <span className="text-sm font-medium uppercase tracking-wider">Archivo Digital</span>
            <span className="text-xs mt-1">{obra.area?.nombre}</span>
          </div>
        )}
      </div>

      {/* Info de la obra */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
            {obra.nombre}
          </h3>
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-3">
            {obra.area?.nombre || 'General'}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span className="truncate max-w-[60%] bg-gray-50 px-2 py-1 rounded">
            {obra.genero_tecnica || 'Técnica mixta'}
          </span>
          <span className="font-mono font-medium text-gray-400">
            {obra.anio_creacion}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Componente Principal ---
export default function PublicProfileView() {
  useDocumentTitle("Vartica | Perfil del Artista");
  const { link } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getPublicProfile(link);
        if (!data) setError(true);
        else setProfileData(data);
      } catch (err) {
        console.error('Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (link) fetchPublicProfile();
  }, [link]);

  // Loading State (Centrado y limpio)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Cargando portafolio...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !profileData?.artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Perfil no encontrado</h1>
          <p className="text-gray-500 mb-6">El enlace parece estar roto o el artista no existe.</p>
          <a href="/" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const { artist, obras_aceptadas } = profileData;
  
  // Cálculo de edad
  const birthDate = new Date(artist.fecha_nacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Lógica de Avatar: Preferencia DB -> Iniciales -> Genérica
  const avatarSrc = artist.avatar_url || getInitialsAvatar(artist.alias || 'Artista');

  // Redes Sociales
  const socialLinks = [
    { type: 'instagram', url: artist.instagram, label: 'Instagram', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
    { type: 'twitter', url: artist.x_twitter, label: 'X (Twitter)', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> },
    { type: 'linkedin', url: artist.linkedin, label: 'LinkedIn', icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/> }
  ].filter(link => link.url);

  return (
    <>
      <Navbar />
      
      {/* Main Wrapper */}
      <div className="relative min-h-screen bg-gray-50 overflow-hidden">
        
        {/* Fondo Animado con Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none h-[60vh]">
          <Velustro />
          {/* Degradado para suavizar la unión con el contenido blanco de abajo */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-gray-50"></div>
        </div>

        <div className="relative z-10 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Tarjeta de Perfil Glassmorphic */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 md:p-10 mb-16 relative overflow-hidden"
          >
            {/* Decoración de fondo en la tarjeta */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Avatar del Artista */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                  <img
                    src={avatarSrc}
                    alt={artist.alias}
                    className="w-full h-full rounded-full object-cover border-4 border-white bg-white"
                  />
                </div>
              </div>

              {/* Información Principal */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {artist.alias}
                </h1>
                <p className="text-xl text-indigo-600 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                  {artist.area?.nombre || 'Artista Multidisciplinar'}
                  {artist.country && (
                    <span className="text-gray-400 text-sm font-normal border-l pl-2 border-gray-300">
                      📍 {artist.country}
                    </span>
                  )}
                </p>

                {/* Estadísticas Compactas */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                  <div className="text-center px-4 py-2 bg-white/50 rounded-lg border border-gray-100">
                    <span className="block text-2xl font-bold text-gray-800">{obras_aceptadas.length}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Obras</span>
                  </div>
                  <div className="text-center px-4 py-2 bg-white/50 rounded-lg border border-gray-100">
                    <span className="block text-2xl font-bold text-gray-800">{age}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Edad</span>
                  </div>
                  <div className="text-center px-4 py-2 bg-white/50 rounded-lg border border-gray-100">
                    <span className="block text-2xl font-bold text-gray-800">{new Date(artist.created_at).getFullYear()}</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Miembro desde</span>
                  </div>
                </div>

                {/* Botones Sociales */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    {socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        aria-label={link.label}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">{link.icon}</svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Galería Section */}
          <div className="mt-8">
           <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative">
              {/* Título con gradiente */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-500">
                Portafolio
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="h-0.5 w-10 bg-gradient-to-r from-indigo-500 to-indigo-200 rounded-full"></span>
                <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">
                  Colección Oficial en el Metaverso
                </p>
              </div>
            </div>

            {/* Badge estilo cristal más integrado */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl transition-colors duration-300">
                <span className="text-xl">🎨</span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-lg font-bold">{obras_aceptadas.length}</span>
                  <span className="text-[10px] font-semibold opacity-70 uppercase">Obras Disponibles</span>
                </div>
              </div>
            </div>
          </div>

            {obras_aceptadas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {obras_aceptadas.map((obra) => (
                  <ObraCard key={obra.id} obra={obra} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300"
              >
                <div className="text-6xl mb-4 opacity-30">🖼️</div>
                <h3 className="text-xl font-medium text-gray-900">Portafolio en construcción</h3>
                <p className="text-gray-500 mt-2">Este artista aún no tiene obras públicas disponibles.</p>
              </motion.div>
            )}
          </div>

        </div>
      </div>
        <Footer />

    </>
  );
  
}