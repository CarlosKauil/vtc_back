import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";

const areaData = {
  literatura: {
    nombre: "Literatura",
    descripcion: "Descubre la riqueza de la narrativa, la poesía y los textos que dan vida al metaverso.",
    img: "/images/Literatura.jpg",
    color: "from-blue-900 to-cyan-900",
    glow: "shadow-cyan-500/50"
  },
  // ... resto de tus datos ...
   pintura: {
    nombre: "Pintura",
    descripcion: "Sumérgete en la creatividad de los pintores más innovadores y sus obras vibrantes.",
    img: "/images/Pintura.jpg",
    color: "from-pink-900 to-purple-900", 
    glow: "shadow-pink-500/50"
  },
   musica: {
    nombre: "Música",
    descripcion: "Experimenta la fusión de melodías, ritmos y arte sonoro en un entorno digital.",
    img: "/images/Musica.jpg",
    color: "from-emerald-900 to-blue-900",
    glow: "shadow-emerald-500/50"
  },
   escultura: {
    nombre: "Escultura",
    descripcion: "Admira las formas y volúmenes extraordinarios de la escultura en el mundo virtual.",
    img: "/images/Escultura.jpg",
    color: "from-yellow-700 to-indigo-900",
    glow: "shadow-yellow-500/50"
  }
};

export default function AreaDetail() {
  const { area } = useParams();
  const data = areaData[area] || areaData.literatura;

  return (
    // CAMBIO 1: padding reducido en móvil (px-4) y flex-col para centrar contenido
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-20 overflow-hidden">
      
      {/* --- FONDO (Sin cambios) --- */}
      <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-80 transition-colors duration-700`}></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      
      {/* --- TARJETA PRINCIPAL --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {/* CAMBIO 2: Layout Responsivo
           - flex-col: En móvil, los elementos van uno debajo del otro.
           - lg:flex-row: En pantallas grandes, van lado a lado.
           - h-auto: La altura se adapta al contenido en móvil.
           - min-h-[...]: Altura mínima en desktop.
        */}
        <div className="relative bg-[#101623]/80 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch lg:min-h-[500px]">
          
          {/* --- LADO IMAGEN (Arriba en móvil, Izquierda en PC) --- */}
          {/* w-full en móvil, w-1/2 en desktop. Altura controlada. */}
          <div className="w-full lg:w-[50%] relative p-6 flex items-center justify-center bg-gradient-to-br from-[#1a2239]/50 to-transparent min-h-[300px] lg:min-h-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px] group"
            >
               {/* Glow detrás de la imagen */}
               <div className={`absolute -inset-4 bg-gradient-to-r ${data.color} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
               
               <img
                src={data.img}
                alt={data.nombre}
                className="relative z-10 object-cover w-full h-full rounded-[20px] shadow-2xl border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-colors duration-500"
              />
              
              {/* Badge (Ajustado tamaño texto) */}
              <div className="absolute top-4 left-4 z-20">
                 <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                   <Sparkles size={12} className="text-[#58d3d8]" />
                   <span>Colección Exclusiva</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* --- LADO TEXTO (Abajo en móvil, Derecha en PC) --- */}
          <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start justify-center px-6 py-8 lg:p-12 text-center lg:text-left relative">
            
            {/* Decoración fondo */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full" // Asegura que ocupe el ancho para centrar/alinear
            >
              {/* CAMBIO 3: Tipografía Responsiva 
                 - text-3xl (móvil) -> text-5xl (tablet) -> text-6xl (desktop)
                 - break-words: Evita que palabras largas rompan el layout
              */}
              <h2 className="font-['Zen_Dots'] text-3xl sm:text-5xl lg:text-6xl text-[#58d3d8] uppercase font-extrabold mb-4 lg:mb-6 drop-shadow-[0_0_15px_rgba(88,211,216,0.4)] break-words leading-tight">
                {data.nombre}
              </h2>
              
              {/* Línea decorativa */}
              <div className="h-1 w-16 lg:w-24 bg-[#58d3d8] rounded-full mb-6 mx-auto lg:mx-0 shadow-[0_0_10px_#58d3d8]"></div>

              {/* Descripción */}
              <p className="text-[#ddfff2] text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                {data.descripcion}
              </p>

              {/* Botones (Stack en móvil muy pequeño, fila en normal) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <Link
                  to="/"
                  className="group relative w-full sm:w-auto px-6 py-3 rounded-full bg-transparent border border-[#58d3d8] text-[#58d3d8] font-bold uppercase tracking-wider overflow-hidden hover:text-[#101623] transition-colors duration-300 flex items-center justify-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-[#58d3d8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
                    <ArrowLeft size={18} /> Volver
                  </span>
                </Link>

                
              </div>
            </motion.div>
          </div>

          {/* Badge Flotante Superior (Oculto en móvil para ahorrar espacio) */}
          <div className="absolute top-4 right-4 hidden lg:block pointer-events-none">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-mono text-cyan-200">Live Gallery</span>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}