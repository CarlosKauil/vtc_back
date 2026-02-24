
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Metaverso.css';

// --- COMPONENTE: MODAL DE FEEDBACK (Glass Style) ---
const FeedbackModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-modal">
        <div className="modal-header">
          <h3>✨ Tu Opinión Importa</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <p className="modal-desc">Ayúdanos a pulir la experiencia del metaverso.</p>
        
        <div className="star-rating-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              className={`star-btn ${star <= rating ? "active" : ""}`}
              onClick={() => setRating(star)}
            >★</button>
          ))}
        </div>

        <textarea 
          className="glass-input"
          placeholder="¿Qué te ha parecido? Reporta bugs o sugiere mejoras..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={handleSubmit} className="btn-liquid-primary">
          Enviar Feedback
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE DEL JUEGO ---
function UnityGame({ urls }) {
  const navigate = useNavigate();

  const { unityProvider, loadingProgression, isLoaded, requestFullscreen } = useUnityContext({
    loaderUrl: urls.loaderUrl,
    dataUrl: urls.dataUrl,
    frameworkUrl: urls.frameworkUrl,
    codeUrl: urls.codeUrl,
  });

  const [isPortrait, setIsPortrait] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Lógica de Orientación
  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', checkOrientation);
    checkOrientation();
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const handleSendFeedback = (data) => {
    console.log("Feedback:", data);
    // Aquí tu fetch al backend...
    setShowFeedback(false);
  };

  return (
    <div className="page-layout">
      {/* 1. Fondo Líquido Animado */}
      <div className="liquid-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* 2. Navbar Importado */}
      <div className="ui-layer-top">
        <Navbar />
      </div>

      {/* 3. Contenido Principal */}
      <main className="main-content">
        {isPortrait ? (
          <div className="glass-warning">
            <div className="icon-rotate">⟳</div>
            <h2>Experiencia Horizontal</h2>
            <p>Gira tu dispositivo para sumergirte.</p>
          </div>
        ) : (
          <div className="glass-console mt-12">
            {/* Header del Panel */}
            <div className="glass-header">
              <div className="status-indicator">
                <span className="dot"></span> Online
              </div>
              <h1 className="console-title">METAVERSO</h1>
              <div className="window-controls">
                <span></span><span></span><span></span>
              </div>
            </div>

            {/* Viewport Unity (900x600) */}
            <div className="unity-viewport">
              {!isLoaded && (
                <div className="glass-loader">
                  <div className="liquid-spinner"></div>
                  <p>Cargando el Entorno... {Math.round(loadingProgression * 100)}%</p>
                </div>
              )}
              <Unity unityProvider={unityProvider} className="unity-canvas" />
            </div>

            {/* Footer del Panel (Controles) */}
            <div className="glass-footer">
              <button className="btn-glass btn-vr-trigger" onClick={() => navigate('/vr')}>
                🥽 MODO VR
              </button>
              <button className="btn-glass" onClick={() => setShowFeedback(true)}>
                💬 Feedback
              </button>
              <button className="btn-glass" onClick={() => requestFullscreen(true)}>
                ⛶ Fullscreen
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer Importado */}
      <div className="ui-layer-bottom">
        <Footer />
      </div>

      {/* 5. Modals */}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} onSubmit={handleSendFeedback} />
      )}
    </div>
  );
}

// --- COMPONENTE WRAPPER ---
export default function Metaverso() {
  const [unityUrls, setUnityUrls] = useState(null);
  const [error, setError] = useState(null);
  
  // Tu URL de producción
  const BACKEND_URL = 'https://backend-z57u.onrender.com/api/unity-files';

  useEffect(() => {
    fetch(BACKEND_URL)
      .then(res => res.ok ? res.json() : Promise.reject("Error de conexión"))
      .then(setUnityUrls)
      .catch(err => setError(err.toString()));
  }, []);

  if (error) return (
    <div className="page-layout error-layout">
        <Navbar />
        <div className="glass-warning error">⚠ {error}</div>
        <Footer />
    </div>
  );

  if (!unityUrls) return (
    <div className="page-layout loading-layout">
        <Navbar />
        <div className="glass-loader-initial">
            <div className="liquid-spinner"></div>
        </div>
        <Footer />
    </div>
  );

  return <UnityGame urls={unityUrls} />;
}