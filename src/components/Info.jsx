import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Palette, Globe, Users, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import Footer from '../components/Footer';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'animate.css';

// Card info
function InfoCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-gradient-to-br from-white via-slate-100 to-cyan-50 border border-slate-200 rounded-xl h-full p-6 shadow group hover:bg-white transition">
      <div className="flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-cyan-500 group-hover:scale-125 transition-transform" />
      </div>
      <h4 className="text-lg font-semibold text-slate-900 text-center mb-2">{title}</h4>
      <p className="text-slate-700 text-center text-sm">{description}</p>
    </div>
  );
}

// Imágenes del carrusel
const heroImages = [
  { src: "/images/img-meta.png", alt: "VARTICA Metaverse" },
  { src: "https://i.pinimg.com/736x/7a/d0/ae/7ad0ae3031d9825c9416550c85be8934.jpg", alt: "VARTICA Experiencia Digital" },
  { src: "https://i.pinimg.com/736x/05/1d/13/051d130ada50096d6dbbe3b520d8ec5b.jpg", alt: "Arte 3D e Interacción" }
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

      <main className="pt-24 px-4 bg-gray-900 min-h-screen">
        {/* HERO + Carrusel */}
        <section className="max-w-7xl mx-auto py-12">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8 md:gap-16">
            <div className="md:w-1/2 flex flex-col justify-center space-y-6 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold uppercase text-white">
                ¿Qué es VARTICA Metaverse?
              </h2>
              <br />
              <hr />
              <br />

              <p className="text-lg text-[#ddfff2] text-justify">
                VARTICA Metaverse es un entorno digital inmersivo que combina el arte
                tradicional y la tecnología actual para crear experiencias únicas en un espacio tridimensional.
                Este metaverso está diseñado específicamente para artistas, brindándoles un escenario global
                donde pueden compartir sus creaciones de manera innovadora e interactiva, además de aumentar
                la popularidad de su trabajo y obtener un mejor feedback de más personas.
              </p>

              <p className="text-lg text-[#ddfff2] text-justify">
                ¿Eres un pintor, escultor, cantante, compositor o escritor y quieres exponer
                tus creaciones de una forma asombrosa y nueva? ¡Únete a VARTICA Metaverse!
              </p>

              <div className="flex justify-center md:justify-start mt-4">
                <Link
                  to="/"
                  className="relative inline-block px-10 py-4 font-semibold text-white rounded-full border-2 border-[#08ffea20] overflow-hidden group transition-all duration-500 hover:shadow-[0_0_20px_#38bdf8]"
                >
                  <span className="relative z-10">Empieza</span>
                  <span className="absolute top-1/2 left-1/2 w-6 h-6 bg-[#38bdf8] rounded-full opacity-0 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:w-40 group-hover:h-40 group-hover:opacity-100"></span>
                </Link>
              </div>
            </div>

            {/* Carrusel hero */}
            <div className="md:w-1/2 w-full flex items-center justify-center">
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
                      className="w-full h-72 md:h-[350px] object-cover rounded-2xl border-4 border-cyan-200/50 shadow-2xl animate__animated animate__fadeIn"
                      style={{ animationDuration: "1.3s" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* INFO CARDS */}
        <section className="py-10 px-0 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoItems.map((item, idx) => (
              <InfoCard
                key={idx}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </section>

        {/* BLOQUES DESTACADOS */}
        <section className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 md:p-12 max-w-7xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-[#ddfff2] mb-6 text-2xl font-bold">Más Detalles</h3>
              <p className="text-lg text-[#ddfff2] text-justify mb-6">
                VARTICA Metaverse es un entorno digital inmersivo que combina arte tradicional y tecnología actual para crear experiencias únicas en un espacio tridimensional.
                Está pensando para artistas que buscan innovar, conectar y exponer sus obras al mundo.
              </p>
              <p className="text-lg text-[#ddfff2] text-justify">
                ¿Eres un creador y buscas proyectar tu arte? ¡Súmate a la nueva dimensión!
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br p-2 from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/30 p-6 rounded-xl">
                <div className="text-[#ddfff2] mb-2 font-bold">Experiencia 3D</div>
                <div className="text-cyan-200">Espacio Tridimensional Inmersivo</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 p-6 rounded-xl">
                <div className="text-[#ddfff2] mb-2 font-bold">Interactividad</div>
                <div className="text-purple-200">Conexión en Tiempo Real</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 p-6 rounded-xl">
                <div className="text-[#ddfff2] mb-2 font-bold">Alcance Global</div>
                <div className="text-green-200">Audiencia Mundial</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 👇 Footer condicional */}
      {showFooter && <Footer />}
    </>
  );
}
