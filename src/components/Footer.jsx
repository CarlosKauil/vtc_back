import { Link } from "react-router-dom";
import { FileText, Hexagon, Instagram, Twitter, Github, Globe } from "lucide-react";

export default function Footer() {
  const links = [
    { to: "/", text: "Inicio" },
    { to: "/info", text: "Información" },
    { to: "/metaverso", text: "Explorar Metaverso", highlight: true },
    { to: "/login", text: "Acceso Artistas" },
  ];

  // Solo queda Términos y Condiciones
  const legals = [
    { to: "/terms-and-conditions", text: "Términos y Condiciones" },
  ];

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/40 backdrop-blur-lg">
      {/* Efecto de luz superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca y Misión */}
          <div className="col-span-1 lg:col-span-2">
            {/* LOGO: Aumenté el margen inferior a mb-8 para separarlo del texto */}
            <Link to="/" className="flex items-center gap-2 group w-fit mb-8">
              <div className="relative">
                <Hexagon className="w-8 h-8 text-indigo-500 group-hover:rotate-90 transition-transform duration-700" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
              <h3 className="font-['Zen_Dots'] text-2xl text-white tracking-widest group-hover:text-indigo-100 transition-colors">
                KREAVERSE
              </h3>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              La plataforma definitiva donde el arte digital y el metaverso convergen. 
              Creamos espacios inmersivos para la próxima generación de creadores.
            </p>
            
            
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-white font-semibold mb-6 border-b border-white/10 pb-2 inline-block">Plataforma</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`text-sm transition-all duration-300 flex items-center gap-2 group w-fit
                      ${link.highlight 
                        ? "text-indigo-400 font-medium hover:text-indigo-300" 
                        : "text-gray-400 hover:text-white hover:translate-x-1"
                      }`}
                  >
                    {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 border-b border-white/10 pb-2 inline-block">Legal</h4>
            <ul className="space-y-3">
              {legals.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group w-fit"
                  >
                    <FileText size={14} className="opacity-50 group-hover:opacity-100 group-hover:text-indigo-400 transition-all" />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Kreaverse Inc. Todos los derechos reservados.</p>
          
          {/* Indicador de estado (Opcional, se ve bien estéticamente sin el soporte) */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span>Sistemas Operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}