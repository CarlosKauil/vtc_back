import { Link } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react"; // Agregué iconos para mejor UI

export default function Services() {
  return (
    <section id="Services" className="relative min-h-screen w-full overflow-hidden">
      
      {/* --- CAPA DE FONDO PARALLAX --- */}
      {/* 'bg-fixed' es la clave para el efecto parallax */}
      <div 
        className="absolute inset-0 w-full h-full bg-fixed bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/images/Quienes.jpg')" }}
      >
        {/* Overlay Oscuro (Gradiente) para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-[1px]"></div>
      </div>

      {/* --- CONTENIDO (Con z-index para estar sobre la imagen) --- */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          
          {/* Título */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-['Orbitron'] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 uppercase tracking-wider drop-shadow-2xl">
            ¿Quiénes pueden unirse?
          </h2>

          {/* Divisor Decorativo */}
          <div className="flex items-center justify-center gap-4 opacity-50">
             <div className="h-px w-12 md:w-24 bg-cyan-400"></div>
             <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
             <div className="h-px w-12 md:w-24 bg-cyan-400"></div>
          </div>

          {/* Párrafo Descriptivo */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl">
            <h3 className="text-xl md:text-3xl text-gray-200 font-light leading-relaxed">
              Pintores, escultores, músicos, compositores, escritores y cualquier artista que desee dar un 
              <span className="text-cyan-400 font-semibold"> giro innovador </span> 
              a la forma en que comparte su arte con el mundo.
            </h3>
          </div>

          {/* Botón Animado Moderno */}
          <div className="pt-6">
            <Link 
              to="/artist-register" 
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 font-['Orbitron'] font-bold uppercase tracking-widest rounded-full overflow-hidden hover:text-white transition-colors duration-300"
            >
              {/* Fondo que se llena al hacer hover */}
              <span className="absolute inset-0 w-full h-full bg-cyan-600 transform -translate-x-full skew-x-12 transition-transform duration-500 group-hover:translate-x-0 group-hover:skew-x-0"></span>
              
              <span className="relative flex items-center gap-2 z-10">
                <UserPlus className="w-5 h-5" />
                Registrarme
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}