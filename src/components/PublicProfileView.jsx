import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfile } from '../api/profile';
import Navbar from '../components/Navbar';
import { Velustro } from "uvcanvas";
import { motion } from "framer-motion";
import { useDocumentTitle } from '../hooks/useDocumentTitle';


// --- Componente individual de obra ---
const ObraCard = ({ obra }) => {
  useDocumentTitle("Vartica | Perfil Público del Artista");
  const isImage =
    obra.archivo_url &&
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(
      obra.archivo.split('.').pop().toLowerCase()
    );
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer">
      <div className="h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={obra.archivo_url}
            alt={obra.nombre}
            className="w-full h-full object-cover transition duration-500 hover:opacity-90"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <span className="text-4xl mb-2">🖼️</span>
            <span className="text-base font-semibold">{obra.area?.nombre || 'Archivo Aprobado'}</span>
            <span className="text-xs mt-1">Sin vista previa de imagen</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">{obra.nombre}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-3">{obra.area?.nombre || 'Área Desconocida'}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Técnica: {obra.genero_tecnica || 'N/A'}</span>
          <span className="font-semibold text-gray-600">{obra.anio_creacion}</span>
        </div>
      </div>
    </div>
  );
};

const infoAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function PublicProfileView() {
  const { link } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      setError(false);
      try {
        // Asegura que el endpoint recibe el valor dinámico, NUNCA '{link}'
        const data = await getPublicProfile(link);
        if (data === null) {
          setError(true);
        } else {
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error al cargar perfil público:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (link) fetchPublicProfile();
  }, [link]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-lg text-gray-600 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Cargando perfil...
        </span>
      </div>
    );
  }

  if (error || !profileData || !profileData.artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg border-t-4 border-red-500">
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            404 - Perfil No Encontrado 😔
          </h1>
          <p className="text-gray-600">
            El enlace de perfil "/artist/{link}" no existe o ha ocurrido un error.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Verifica el URL e intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  const { artist, obras_aceptadas } = profileData;

  const birthDate = new Date(artist.fecha_nacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Redes sociales y país solo si existen (no rompe lógica)
  const socialLinks = [
    artist.instagram && {
      label: 'Instagram',
      url: artist.instagram.startsWith('http') ? artist.instagram : `https://instagram.com/${artist.instagram.replace('@','')}`,
      icon: '📷'
      
    },
    artist.x_twitter && {
      label: 'X (Twitter)',
      url: artist.x_twitter.startsWith('http') ? artist.x_twitter : `https://x.com/${artist.x_twitter.replace('@','')}`,
      icon: '🐦'
    },
    artist.linkedin && {
      label: 'LinkedIn',
      url: artist.linkedin,
      icon: '💼'
    }
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      {/* Fondo con animación y banner tipo LinkedIn */}
      <div className="relative min-h-screen mt-24 overflow-hidden">
        {/* Banner y fondo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-600 opacity-90"></div>
          <Velustro />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        {/* Cabecera tipo LinkedIn */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 pt-10 pb-8">
            {/* Avatar */}
            <img
              src={artist.avatar_url}
              alt={artist.alias}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              style={{ minWidth: '128px', minHeight: '128px' }}
            />
            {/* Datos básicos */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-1 tracking-tight">{artist.alias}</h1>
              <p className="text-lg md:text-2xl text-blue-200 font-light mb-1">{artist.area?.nombre || 'Artista Multidisciplinar'}</p>
              <span className="mt-1 text-sm text-indigo-100 block">
                Miembro desde {new Date(artist.created_at).getFullYear()}
              </span>
              {/* País, si existe */}
              {artist.country && (
                <div className="flex items-center mt-2">
                  <span className="mr-2">🌎</span>
                  <span className="text-white font-medium">{artist.country}</span>
                </div>
              )}
              {/* Redes sociales, si existen */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mt-3 ">
                  {socialLinks.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full font-medium bg-white bg-opacity-10 hover:bg-white/20 text-black/70 text-sm transition"
                    >
                      <span className="mr-2">{link.icon}</span> {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Estadísticas estilo card */}
          <div className="flex gap-8 pb-10">
            <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">{obras_aceptadas.length}</span>
              <span className="text-xs text-gray-500">Obras</span>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">{age}</span>
              <span className="text-xs text-gray-500">Edad</span>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-indigo-600">{new Date(artist.created_at).getFullYear()}</span>
              <span className="text-xs text-gray-500">Miembro desde</span>
            </div>
          </div>
        </div>
        {/* Portafolio de obras */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-3 border-b-2 border-indigo-200">
            Número de obras en el Metaverso: {obras_aceptadas.length} Obras
          </h2>
          {obras_aceptadas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {obras_aceptadas.map((obra) => (
                <ObraCard key={obra.id} obra={obra} />
              ))}
            </div>
          ) : (
            <div className="text-center p-16 bg-white/80 backdrop-blur-md rounded-xl shadow border-l-4 border-gray-400 mb-10">
              <p className="text-2xl text-gray-500 font-light">
                Este artista está construyendo su portafolio. ¡Pronto habrá nuevas obras!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Actualmente no tiene obras públicas aprobadas.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
