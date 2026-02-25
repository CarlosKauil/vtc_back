import React from 'react';
import PDFViewer from "./PDFViewer";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from "framer-motion";

// Componente para envolver el PDF con estilo de tarjeta
const DocCard = ({ title, subtitle, icon, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: delay }}
    className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl hover:border-indigo-500/30 transition-colors duration-300"
  >
    {/* Encabezado de la tarjeta */}
    <div className="p-5 border-b border-white/5 bg-white/5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:text-indigo-200 group-hover:bg-indigo-500/30 transition-all">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
    
    {/* Contenedor del PDF */}
    <div className="p-1 bg-slate-950/30 h-[500px] md:h-[600px] overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-grid-white/[0.02]"></div> {/* Patrón de fondo opcional */}
      <div className="relative z-10 h-full w-full rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  </motion.div>
);

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] relative overflow-hidden">
        
        {/* Fondo Ambiental (Luces) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium mb-6 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Actualizado: Octubre 2025
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
            >
              Documentos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Legales</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400 leading-relaxed"
            >
              Transparencia y seguridad para nuestros artistas y coleccionistas.
              <br className="hidden md:block"/> Por favor revisa nuestros lineamientos.
            </motion.p>
          </div>

          {/* Grid de Documentos */}
          <div className="grid lg:grid-cols-2 gap-10">
            
            {/* Tarjeta 1: Términos */}
            <DocCard 
              title="Términos y Condiciones" 
              subtitle="Reglas de Uso"
              delay={0.2}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <PDFViewer
                title="Términos y Condiciones"
                pdfUrl="/assets/TERMINOS-Y-CONDICIONES.pdf"
              />
            </DocCard>

            {/* Tarjeta 2: Privacidad */}
            <DocCard 
              title="Aviso de Privacidad" 
              subtitle="Protección de Datos"
              delay={0.4}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              <PDFViewer
                title="Aviso de Privacidad"
                pdfUrl="/assets/AVISO-DE-PRIVACIDAD.pdf"
              />
            </DocCard>

          </div>
          
          {/* Nota al pie */}
          <div className="mt-16 text-center border-t border-slate-800/50 pt-8">
            <p className="text-slate-500 text-sm">
              ¿Tienes dudas sobre estos documentos? <a href="/contacto" className="text-indigo-400 hover:text-indigo-300 transition-colors underline">Contáctanos</a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}