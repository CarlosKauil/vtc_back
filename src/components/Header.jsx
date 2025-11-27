import React from "react";

export default function Header() {
  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Video de fondo */}
      <iframe
        src="https://www.youtube.com/embed/SDVat3-WACg?autoplay=1&mute=1&controls=0&loop=1&playlist=SDVat3-WACg&modestbranding=1&showinfo=0"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Video de fondo"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        style={{
          zIndex: 1,
          width: "100vw",
          height: "100vh",
        }}
      ></iframe>

      {/* Overlay oscuro */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))",
          zIndex: 2,
        }}
      ></div>

      {/* Contenido */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center w-full"
        style={{ zIndex: 3 }}
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 animate__animated animate__zoomInLeft title-vtc"
          style={{ animationDuration: "2s", color: "#fff" }}
        >
          VARTICA <strong className="text-blue-400 font-black">Metaverse</strong>
        </h1>
        <p
          className="text-lg md:text-xl mb-8 animate__animated animate__zoomIn sub-title"
          style={{ animationDuration: "2s", color: "#fff" }}
        >
          ¡El Metaverso dirigido al ámbito del arte y a la cultura real!
        </p>
        <div>
          <a
            href="#"
            className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Iniciar</span>
            <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-20 transition"></span>
          </a>
        </div>
      </div>
    </div>
  );
}