import { Mail, User, MessageSquare, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactForm() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117] relative overflow-hidden text-gray-200">
      
      {/* Fondo Mejorado (Grid + Luces de Neón) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Luces difuminadas de fondo */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" />
        
        {/* Patrón de cuadrícula tecnológica */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
      </div>

      {/* Cabecera */}
      <Navbar />

      {/* Contenido Principal (Formulario centrado) */}
      <main id="contacto" className="flex-grow flex items-center justify-center w-full px-4 pt-28 pb-12 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl w-full relative group">
          
          {/* Glow específico de la tarjeta */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-xl opacity-60 transition-opacity duration-300 -z-10" />

          {/* Tarjeta del Formulario */}
          <div className="relative rounded-3xl p-8 sm:p-10 backdrop-blur-xl bg-[#151822]/80 border border-white/10 shadow-2xl">
            
            <div className="text-center mb-10">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 text-4xl font-bold tracking-wide">
                Contáctanos
              </h2>
              <p className="text-gray-400">
                ¿Te interesa el Plan Galería o quieres una solución a medida para tu espacio? Escríbenos y diseñemos algo increíble.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Input Nombre */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300 ml-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-cyan-500/70" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>

                {/* Input Correo */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-cyan-500/70" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Input Mensaje */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300 ml-1">
                  Mensaje
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-cyan-500/70" />
                  </div>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 resize-none"
                    placeholder="Cuéntanos más sobre lo que necesitas..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                className="w-full py-4 px-6 mt-4 rounded-xl flex items-center justify-center gap-2 font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-[1.02] transition-all duration-300"
              >
                <span>Enviar Mensaje</span>
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>
        </div>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}