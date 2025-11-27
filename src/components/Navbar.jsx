import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/20 max-w-7xl mx-auto">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="text-white text-2xl hover:text-white/80 transition-colors">
              Kreaverse
            </a>

            {/* Botón hamburguesa para móvil */}
            <button
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center group"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span 
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </button>

            {/* Links de navegación - Desktop */}
            <ul className="hidden md:flex gap-8 items-center">
              <li>
                <a 
                  href="/" 
                  className="text-white/90 hover:text-white transition-colors relative group"
                >
                  Inicio
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a 
                  href="/info" 
                  className="text-white/90 hover:text-white transition-colors relative group"
                >
                  Información
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a 
                  href="/metaverso" 
                  className="text-white/90 hover:text-white transition-colors relative group"
                >
                  Metaverso
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a 
                  href="/login" 
                  className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full border border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Links de navegación - Mobile */}
          <ul 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              menuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
            }`}
          >
            <li className="py-3 border-t border-white/10">
              <a 
                href="/" 
                onClick={() => setMenuOpen(false)}
                className="text-white/90 hover:text-white transition-colors block"
              >
                Inicio
              </a>
            </li>
            <li className="py-3 border-t border-white/10">
              <a 
                href="/info" 
                onClick={() => setMenuOpen(false)}
                className="text-white/90 hover:text-white transition-colors block"
              >
                Información
              </a>
            </li>
            <li className="py-3 border-t border-white/10">
              <a 
                href="/metaverso" 
                onClick={() => setMenuOpen(false)}
                className="text-white/90 hover:text-white transition-colors block"
              >
                Metaverso
              </a>
            </li>
            <li className="py-3 border-t border-white/10">
              <a 
                href="/login" 
                onClick={() => setMenuOpen(false)}
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full border border-white/30 transition-all inline-block"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
