// src/pages/AreaDetail.jsx
import { useParams, Link } from "react-router-dom";

// Ejemplo de props/data para cada área/puedes cargarlo desde API o JSON externo
const areaData = {
  literatura: {
    nombre: "Literatura",
    descripcion: "Descubre la riqueza de la narrativa, la poesía y los textos que dan vida al metaverso.",
    img: "/images/Literatura.jpg",
    color: "from-blue-900 to-cyan-900"
  },
  pintura: {
    nombre: "Pintura",
    descripcion: "Sumérgete en la creatividad de los pintores más innovadores y sus obras vibrantes.",
    img: "/images/Pintura.jpg",
    color: "from-pink-700 to-blue-800"
  },
  musica: {
    nombre: "Música",
    descripcion: "Experimenta la fusión de melodías, ritmos y arte sonoro en un entorno digital.",
    img: "/images/Musica.jpg",
    color: "from-emerald-800 to-blue-900"
  },
  escultura: {
    nombre: "Escultura",
    descripcion: "Admira las formas y volúmenes extraordinarios de la escultura en el mundo virtual.",
    img: "/images/Escultura.jpg",
    color: "from-yellow-600 to-indigo-900"
  }
};

export default function AreaDetail() {
  const { area } = useParams(); // URL dinámica tipo /area/pintura
  const data = areaData[area] || areaData.literatura;

  return (
    <section className={`min-h-screen w-full bg-gradient-to-br ${data.color} px-5 py-14 flex items-center justify-center`}>
      <div className="relative bg-gradient-to-tr from-[#101623] via-[#203d5e] to-[#162235] rounded-3xl w-full max-w-3xl mx-auto shadow-2xl flex flex-col md:flex-row items-center overflow-hidden">
        
        {/* Imagen del área */}
        <div className="w-full md:w-[52%] h-[300px] md:h-[470px] flex items-center justify-center bg-[#1a2239]">
          <img
            src={data.img}
            alt={data.nombre}
            className="object-cover w-[90%] h-[85%] rounded-2xl shadow-xl border-4 border-cyan-400"
            style={{ maxHeight: "100%" }}
          />
        </div>

        {/* Info de área */}
        <div className="w-full md:w-[48%] flex flex-col items-center justify-center px-6 py-8 md:py-0">
          <h2 className="font-['Zen_Dots'] text-4xl md:text-5xl text-[#58d3d8] uppercase font-extrabold mb-4 text-center drop-shadow-lg">
            {data.nombre}
          </h2>
          <p className="text-white text-lg md:text-xl mb-6 text-center font-sans max-w-xs mx-auto">
            {data.descripcion}
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-8 py-3 rounded-full text-lg font-semibold bg-[#58d3d8] text-[#1a2239] shadow-lg hover:bg-cyan-500 transition"
          >
            Volver a áreas
          </Link>
        </div>

        {/* Botón flotante/descuento tipo marketplace */}
        <div className="absolute top-7 right-10 flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 text-white px-5 py-2 rounded-full shadow-lg border-2 border-cyan-400">
            Explora obras
          </span>
        </div>
      </div>
    </section>
  );
}
