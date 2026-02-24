import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Metaverso.css'; // Reusamos el estilo base
import './MetaversoVR.css'; // Estilos específicos para VR

function UnityVRGame({ urls }) {
  const { unityProvider, loadingProgression, isLoaded, requestFullscreen } = useUnityContext({
    loaderUrl: urls.loaderUrl,
    dataUrl: urls.dataUrl,
    frameworkUrl: urls.frameworkUrl,
    codeUrl: urls.codeUrl,
  });

  const [readyToEnter, setReadyToEnter] = useState(false);

  // Efecto para habilitar el botón de entrada cuando cargue
  useEffect(() => {
    if (isLoaded) setReadyToEnter(true);
  }, [isLoaded]);

  return (
    <div className="page-layout vr-layout">
      <div className="liquid-background vr-variant">
        <div className="blob blob-vr-1"></div>
        <div className="blob blob-vr-2"></div>
      </div>

      <div className="ui-layer-top">
        <Navbar />
      </div>

      <main className="main-content">
        <div className="glass-console vr-console">
          
          {/* Header Específico VR */}
          <div className="glass-header vr-header">
            <div className="status-indicator">
              <span className="dot vr-dot"></span> VR READY
            </div>
            <h1 className="console-title">VARTICA <span className="vr-badge">IMMERSIVE</span></h1>
          </div>

          {/* Área de Contenido */}
          <div className="unity-viewport vr-viewport">
            
            {/* Pantalla de Carga / Instrucciones */}
            {!isLoaded && (
              <div className="glass-loader vr-loader">
                <div className="vr-headset-icon">🥽</div>
                <h3>Preparando Entorno Virtual</h3>
                <p>Por favor, asegúrate de tener espacio libre a tu alrededor.</p>
                <div className="liquid-spinner vr-spinner"></div>
                <small className="loading-text">Cargando Assets VR... {Math.round(loadingProgression * 100)}%</small>
              </div>
            )}

            {/* Capa de Instrucciones (Overlay cuando está cargado pero no ha entrado) */}
            {isLoaded && !readyToEnter && (
               <div className="vr-overlay-instructions">
                   <h2>¡Listo para conectar!</h2>
                   <p>Presiona el botón "Enter VR" en la esquina inferior derecha del juego.</p>
               </div>
            )}

            <Unity unityProvider={unityProvider} className="unity-canvas" />
          </div>

          {/* Footer con advertencias */}
          <div className="glass-footer vr-footer">
            <div className="vr-safety-text">
                ⚠ Recuerda definir tu zona de guardián antes de jugar.
            </div>
            {/* Unity WebXR suele manejar su propio botón de VR, 
                pero podemos dejar el fullscreen por si acaso */}
            <button className="btn-glass" onClick={() => requestFullscreen(true)}>
                ⛶ Pantalla Completa
            </button>
          </div>
        </div>
      </main>

      <div className="ui-layer-bottom">
        <Footer />
      </div>
    </div>
  );
}

export default function MetaversoVR() {
  const [unityUrls, setUnityUrls] = useState(null);
  const [error, setError] = useState(null);
  
  // IMPORTANTE: Aquí simulamos que pides los archivos VR.
  // Tu backend debe estar preparado para recibir '?mode=vr' y devolver
  // las URLs firmadas del bucket 'Buckets/assets/assets_vr'
  const BACKEND_URL = 'https://backend-z57u.onrender.com/api/unity-files?mode=vr';

  useEffect(() => {
    fetch(BACKEND_URL)
      .then(res => {
        if (!res.ok) throw new Error("Error obteniendo configuración VR");
        return res.json();
      })
      .then(data => setUnityUrls(data))
      .catch(err => {
        console.error(err);
        setError("No se pudo iniciar el modo inmersivo. Verifica tu conexión.");
      });
  }, []);

  if (error) return (
    <div className="page-layout error-layout">
        <Navbar />
        <div className="glass-warning error">
            <h2>⛔ ERROR DE SISTEMA VR</h2>
            <p>{error}</p>
            <button className="btn-glass" onClick={() => window.location.href='/'}>Volver al Inicio</button>
        </div>
        <Footer />
    </div>
  );

  if (!unityUrls) return (
    <div className="page-layout loading-layout">
        <Navbar />
        <div className="glass-loader-initial">
             {/* Icono animado diferente para VR */}
            <div className="vr-pulse-icon">🥽</div>
            <p style={{marginTop: 20, color: '#d8b4fe'}}>Calibrando Sensores...</p>
        </div>
        <Footer />
    </div>
  );

  return <UnityVRGame urls={unityUrls} />;
}