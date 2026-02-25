import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Datos de las áreas (Asegúrate de que las rutas de imágenes sean correctas)
const areas = [
  {
    nombre: "Literatura",
    img: "/images/Literatura.jpg",
    descripcion: "Sumérgete en el mundo de la palabra escrita y narrativa.",
    ruta: "/area/literatura",
  },
  {
    nombre: "Pintura",
    img: "/images/Pintura.jpg",
    descripcion: "Explora la creatividad de los grandes pintores del metaverso.",
    ruta: "/area/pintura",
  },
  {
    nombre: "Música",
    img: "/images/Musica.jpg",
    descripcion: "Vibra con melodías y ritmos en un entorno inmersivo.",
    ruta: "/area/musica",
  },
  {
    nombre: "Escultura",
    img: "/images/Escultura.jpg",
    descripcion: "Admira la tridimensionalidad y las formas tangibles de la escultura.",
    ruta: "/area/escultura",
  },
];

// --- Componente: Tarjeta Liquid Glass ---
function AreaCard({ area, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative h-[400px] w-full rounded-[30px] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_0_rgba(88,211,216,0.3)] transition-shadow duration-500"
    >
      {/* 1. Marco de Vidrio Líquido (Borde sutil) */}
      <div className="absolute inset-0 rounded-[30px] border border-white/20 z-20 pointer-events-none"></div>

      {/* 2. Imagen de Fondo (Con efecto Zoom al hover) */}
      <div className="absolute inset-0 w-full h-full bg-slate-900">
        <img
          src={area.img}
          alt={area.nombre}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        {/* Overlay oscuro base para que el texto resalte si la imagen es clara */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>

      {/* 3. Contenido "INFO" (Efecto Glassmorphism iOS Style) */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
        
        {/* Fondo Blur que aparece al hover (Liquid Glass Overlay) */}
        <div className="absolute inset-0 bg-[#0a101f]/60 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></div>

        {/* Texto visible SIEMPRE (Título) */}
        <div className="relative z-20 transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="font-['Zen_Dots'] text-2xl md:text-3xl text-white mb-2 drop-shadow-lg">
            {area.nombre}
          </h3>
          
          {/* Línea decorativa color cyan (#58d3d8) */}
          <div className="h-1 w-12 bg-[#58d3d8] rounded-full transition-all duration-500 group-hover:w-full"></div>
        </div>

        {/* Descripción y Botón (Ocultos inicialmente, aparecen con slide up) */}
        <div className="relative z-20 max-h-0 overflow-hidden group-hover:max-h-[200px] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-0 group-hover:opacity-100">
          <p className="mt-4 text-[18px] text-[#ddfff2] text-justify leading-relaxed">
            {area.descripcion}
          </p>
          
          <Link 
            to={area.ruta}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#58d3d8] text-black font-bold font-['Zen_Dots'] text-sm uppercase tracking-wide hover:bg-white transition-colors duration-300"
          >
            Explorar <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function AreaSection() {
  return (
    <section 
      id="AreaSection" 
      className="relative w-full py-24 px-4 min-h-screen bg-fixed bg-center bg-cover bg-no-repeat overflow-hidden"
      // Usa aquí la misma imagen que usabas en tu CSS original o una textura oscura
      style={{ backgroundImage: "url('/images/fondo-areas.jpg')" }} 
    >
      {/* Overlay Parallax Oscuro (Para que resalten las cards) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#0f172a]/80 to-black/90 backdrop-blur-[2px]"></div>
      
      {/* Contenido Principal */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Encabezado (Estilos basados en tu CSS .title-areas y .parrafo-areas) */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            // Color #58d3d8 aplicado aquí
            className="font-['Zen_Dots'] text-5xl md:text-[55px] leading-tight text-[#58d3d8] uppercase font-bold mb-6 drop-shadow-2xl"
          >
            Áreas del Metaverso
          </motion.h2>
          
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          >
            {/* Texto #fff según tu CSS, tamaño 22px */}
            <p className="text-[18px] md:text-[22px] text-white text-center leading-relaxed">
              Conoce el talento de múltiples artistas en un solo espacio que contiene áreas que muestran diferentes ramas.
            </p>
          </motion.div>
        </div>

        {/* Grid de Cards (Estilo .areas-meta) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area, index) => (
            <AreaCard key={area.nombre} area={area} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}