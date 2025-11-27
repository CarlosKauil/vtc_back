import { useRef } from "react";
import { Link } from "react-router-dom";
import * as anime from 'animejs';
import { splitText } from "animejs/text";

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

function AreaCard({ area }) {
  const titleRef = useRef(null);

  const handleMouseEnter = () => {
    if (titleRef.current) {
      // Limpia splits previos
      titleRef.current.innerHTML = area.nombre;
      const { chars } = splitText(titleRef.current, { chars: true, words: false });
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: ["100%", "0%"],
        easing: "easeOutExpo",
        duration: 480,
        delay: anime.stagger(20),
      });
    }
  };

  return (
    <Link
      to={area.ruta}
      className="group relative rounded-xl shadow-xl overflow-hidden min-h-[320px] flex flex-col"
      onMouseEnter={handleMouseEnter}
    >
      <img
        src={area.img}
        alt={area.nombre}
        className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
      />
      {/* Overlay blur + info al hover */}
      <div className="
        absolute inset-0 w-full h-full
        bg-black bg-opacity-70
        flex flex-col items-center justify-center
        text-white text-center px-4
        opacity-0 group-hover:opacity-100
        backdrop-blur-sm transition-opacity duration-300
      ">
        {/* Texto animado */}
        <h3
          ref={titleRef}
          className="font-['Zen_Dots'] text-2xl mb-2 select-none"
        >
          {area.nombre}
        </h3>
        <p className="font-sans text-base">{area.descripcion}</p>
      </div>
      {/* Nombre área visible sin hover */}
      <div className="
        absolute left-0 right-0 bottom-0
        bg-gradient-to-t from-blue-900 via-blue-600/90 to-transparent
        text-center text-lg font-['Zen_Dots'] text-white font-semibold p-3 pointer-events-none
        group-hover:opacity-0 transition-opacity duration-300"
      >
        {area.nombre}
      </div>
    </Link>
  );
}

export default function AreaSection() {
  return (
    <section id="AreaSection" className="w-full bg-gradient-to-tr from-[#171a2b] via-blue-900 to-[#10111a] py-12 px-4 min-h-[600px]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="font-['Zen_Dots'] text-[42px] leading-tight text-[#58d3d8] uppercase font-bold mb-2 text-center drop-shadow-lg">
            Áreas del Metaverso
          </h2>
          <p className="text-[22px] text-white p-5 text-center">
            Conoce el talento de múltiples artistas en un solo espacio que contiene áreas que muestran diferentes ramas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {areas.map(area => (
            <AreaCard area={area} key={area.nombre} />
          ))}
        </div>
      </div>
    </section>
  );
}
