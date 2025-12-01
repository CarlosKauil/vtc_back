import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Footer() {
  const links = [
    { to: "/", text: "Inicio" },
    { to: "/info", text: "Información" },
    { to: "/metaverso", text: "Metaverso" },
    { to: "/login", text: "Login" },
    { to: "/terms-and-conditions", text: "Documentos Legales", hasIcon: true },
  ];

  return (
    <footer className="mt-24 mb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Línea superior sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12" />
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
          {/* Logo/Título */}
          <div className="flex-shrink-0">
            <h3 className="font-['Zen_Dots'] text-white tracking-wider">
              KREAVERSE
            </h3>
          </div>

          {/* Enlaces */}
          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
              >
                {link.hasIcon && (
                  <FileText className="w-3.5 h-3.5 opacity-70" />
                )}
                <span className="relative">
                  {link.text}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright o información adicional (opcional) */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} KREAVERSE. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
