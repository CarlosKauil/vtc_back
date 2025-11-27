import { Unity, useUnityContext } from "react-unity-webgl";
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; 

// Array de "Sabías qué" para mostrar dinámicamente
const facts = [
  "Sabías qué: React usa un DOM virtual, lo que lo hace muy eficiente para actualizar solo los cambios necesarios.",
  "Sabías qué: Tailwind CSS es un framework 'utility-first' que te permite construir diseños complejos sin salir de tu HTML.",
  "Sabías qué: Unity permite exportar juegos y experiencias 3D para web, iOS, Android, PC, y consolas.",
  "Sabías qué: El diseño minimalista se centra en la simplicidad, la funcionalidad y la eliminación de elementos innecesarios.",
  "Sabías qué: La combinación de React y Tailwind es popular por su flexibilidad y rapidez en el desarrollo de interfaces de usuario."
];

export default function Metaverso() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "assets/game.loader.js",
    dataUrl: "assets/game.data",
    frameworkUrl: "assets/game.framework.js",
    codeUrl: "assets/game.wasm",
  });

  // Estado para el texto de "Sabías qué"
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    // Configura el temporizador para cambiar el hecho cada 15 segundos
    const intervalId = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 15000); // 15000 ms = 15 segundos

    // Limpia el temporizador cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans p-4">
      {/* Coloca aquí tu componente Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Contenedor principal que centra el contenido */}
      <div className="flex flex-1 items-center justify-center p-4">
        {/* Wrapper del juego de Unity con estilos de tu CSS */}
        <main className="w-11/12 max-w-5xl aspect-video mx-auto border-2 border-white rounded-[20px] shadow-[0_0_30px_rgba(0,255,255,0.2)] bg-gray-900 relative overflow-hidden">
          
          {/* Pantalla de carga */}
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-10 transition-opacity duration-500 ease-in-out">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-xl font-medium tracking-wide">
                Cargando... {Math.round(loadingProgression * 100)}%
              </p>
            </div>
          )}
          
          {/* Componente de Unity */}
          <Unity
            unityProvider={unityProvider}
            style={{ width: "100%", height: "100%" }}
          />
        </main>
      </div>

      {/* Sección inferior con los "Sabías qué" */}
      <div className="flex justify-center w-full mt-8">
        <div className="w-11/12 max-w-5xl bg-gray-800 p-6 rounded-[20px] shadow-lg border-2 border-gray-700 transition-all duration-500 ease-in-out">
          <h2 className="text-xl font-semibold text-gray-200">Sabías qué:</h2>
          <p className="mt-2 text-lg text-gray-400 font-light">
            {facts[currentFactIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}