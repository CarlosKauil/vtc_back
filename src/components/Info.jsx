import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Palette, Globe, Users, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import Footer from '../components/Footer';
import { motion } from "framer-motion"; // Importamos Framer Motion

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'animate.css';

// Variantes de animación para reusar
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Card info (Convertida a motion.div)
function InfoCard({ icon: Icon, title, description }) {
  return (
    <motion.div 
      variants={fadeInUp} // Hereda la animación del padre
      whileHover={{ y: -10, transition: { duration: 0.3 } }} // Animación extra al pasar el mouse
      className="bg-gradient-to-br from-white via-slate-100 to-cyan-50 border border-slate-200 rounded-xl h-full p-6 shadow-lg group hover:bg-white transition-colors"
    >
      <div className="flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-cyan-500 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <h4 className="text-lg font-semibold text-slate-900 text-center mb-2">{title}</h4>
      <p className="text-slate-700 text-center text-sm">{description}</p>
    </motion.div>
  );  
}

// Imágenes del carrusel
const heroImages = [
  { src: "/images/1.png", alt: "VARTICA Metaverse" },
  { src: "/images/2.png", alt: "Arte 3D e Interacción" },
  { src: "/images/3.png", alt: "Arte 3D e Interacción" },
  { src: "/images/4.png", alt: "Arte 3D e Interacción" },
  { src: "/images/5.png", alt: "Arte 3D e Interacción" },
  { src: "/images/6.png", alt: "Arte 3D e Interacción" }
];

export default function Info({ showFooter = true }) {
  const infoItems = [
    {
      icon: Palette,
      title: "Arte Digital",
      description: "Un espacio tridimensional inmersivo donde el arte tradicional se fusiona con la tecnología actual."
    },
    {
      icon: Globe,
      title: "Escenario Global",
      description: "Comparte tus creaciones con una audiencia mundial en un entorno innovador e interactivo."
    },
    {
      icon: Users,
      title: "Para Artistas",
      description: "Diseñado específicamente para pintores, escultores, cantantes, compositores y escritores."
    },
    {
      icon: Sparkles,
      title: "Experiencias Únicas",
      description: "Aumenta la popularidad de tu trabajo y obtén feedback de más personas de forma inmersiva."
    }
  ];

  return (
    <>
      <Navbar />

      <main className="pt-24 px-4 bg-gray-900 min-h-screen overflow-hidden">
        {/* HERO + Carrusel */}
        <section className="max-w-7xl mx-auto py-12">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8 md:gap-16">
            
            {/* Texto Hero Animado */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 flex flex-col justify-center space-y-6 text-center md:text-left"
            >
              <h2 className="font-['Zen_Dots'] text-4xl md:text-5xl font-bold uppercase text-white">
                ¿Qué es VARTICA Metaverse?
              </h2>
              <br />
              <motion.hr 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="border-gray-700"
              />
              <br />

              <p className="text-lg text-[#ddfff2] text-justify">
                En VARTICA Metaverse la misión es generar una nueva vía de ganancia y sostenibilidad económica para los creadores, superando la limitación de los intermediarios físicos costosos. Está pensado para artistas que buscan maximizar su rentabilidad y exponer sus obras al mundo.
              </p>

              <p className="text-lg text-[#ddfff2] text-justify">
             ¿Eres un creador y buscas proyectar tu arte? ¡Súmate a la nueva dimensión!
              </p>

              <motion.div 
                className="flex justify-center md:justify-start mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="relative inline-block px-10 py-4 font-semibold text-white rounded-full border-2 border-[#08ffea20] overflow-hidden group transition-all duration-500 hover:shadow-[0_0_20px_#38bdf8]"
                >
                  <span className="relative z-10">Empieza</span>
                  <span className="absolute top-1/2 left-1/2 w-6 h-6 bg-[#38bdf8] rounded-full opacity-0 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:w-40 group-hover:h-40 group-hover:opacity-100"></span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Carrusel hero Animado */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 w-full flex items-center justify-center"
            >
              <Swiper
                slidesPerView={1}
                loop={true}
                modules={[EffectFade, Autoplay]}
                effect="fade"
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                className="w-full max-w-lg md:max-w-xl h-72 md:h-[350px] rounded-2xl bg-cyan-200/10"
              >
                {heroImages.map((img) => (
                  <SwiperSlide key={img.src}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-72 md:h-[350px] object-cover rounded-2xl border-4 border-cyan-200/50 shadow-2xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </section>

        {/* INFO CARDS (Entrada en cascada) */}
        <section className="py-10 px-0 max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {infoItems.map((item, idx) => (
              <InfoCard
                key={idx}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </motion.div>
        </section>

        {/* BLOQUES DESTACADOS (Animación Scroll) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 md:p-12 max-w-7xl mx-auto mb-10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-[#ddfff2] mb-6 text-2xl font-bold font-['Zen_Dots'] tracking-wide">Más Detalles</h3>
              <p className="text-lg text-[#ddfff2] text-justify mb-6">
                VARTICA Metaverse es un entorno digital inmersivo que combina arte tradicional y tecnología actual para crear experiencias únicas en un espacio tridimensional.
                Está pensando para artistas que buscan innovar, conectar y exponer sus obras al mundo.
              </p>
              <p className="text-lg text-[#ddfff2] text-justify">
                ¿Eres un creador y buscas proyectar tu arte? ¡Súmate a la nueva dimensión!
              </p>
            </div>

            {/* Lista derecha con animación secuencial */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { title: "Experiencia 3D", sub: "Espacio Tridimensional Inmersivo", colorFrom: "cyan-500", colorTo: "cyan-600", border: "cyan-400", text: "cyan-200" },
                { title: "Interactividad", sub: "Conexión en Tiempo Real", colorFrom: "purple-500", colorTo: "purple-600", border: "purple-400", text: "purple-200" },
                { title: "Alcance Global", sub: "Audiencia Mundial", colorFrom: "green-500", colorTo: "green-600", border: "green-400", text: "green-200" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`bg-gradient-to-br p-2 from-${item.colorFrom}/20 to-${item.colorTo}/20 backdrop-blur-sm border border-${item.border}/30 p-6 rounded-xl mb-2 cursor-default`}
                >
                  <div className="text-[#ddfff2] mb-2 font-['Zen_Dots'] tracking-wide">{item.title}</div>
                  <div className={`text-${item.text}`}>{item.sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </main>

      {showFooter && <Footer />}
    </>
  );
}