import { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

function UnityGame({ urls }) {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: urls.loaderUrl,
    dataUrl: urls.dataUrl,
    frameworkUrl: urls.frameworkUrl,
    codeUrl: urls.codeUrl,
  });

  useEffect(() => {
    console.log('Unity Context inicializado con URLs:', urls);
  }, []);

  useEffect(() => {
    console.log('Loading progression:', loadingProgression);
  }, [loadingProgression]);

  useEffect(() => {
    if (isLoaded) {
      console.log('¡Unity cargado exitosamente!');
    }
  }, [isLoaded]);

  return (
    <div style={{ padding: '20px' }}>
      {!isLoaded && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            Cargando: {Math.round(loadingProgression * 100)}%
          </div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#ddd', 
            borderRadius: '10px', 
            overflow: 'hidden' 
          }}>
            <div style={{
              width: `${loadingProgression * 100}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Por favor espera mientras se carga el juego...
          </div>
        </div>
      )}
      
      <Unity 
        unityProvider={unityProvider}
        style={{ 
          width: '100%', 
          height: '600px', 
          border: '2px solid #333', 
          borderRadius: '8px',
          display: 'block'
        }}
      />

      {isLoaded && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '8px'
        }}>
          ✓ Juego cargado correctamente
        </div>
      )}
    </div>
  );
}

export default function Metaverso() {
  const [unityUrls, setUnityUrls] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = 'https://backend-z57u.onrender.com/api/unity-files';

  useEffect(() => {
    async function fetchUnityUrls() {
      try {
        console.log('Obteniendo URLs del backend...');
        const response = await fetch(BACKEND_URL);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validar que tenemos todas las URLs
        if (!data.loaderUrl || !data.dataUrl || !data.frameworkUrl || !data.codeUrl) {
          throw new Error('Faltan URLs en la respuesta del servidor');
        }
        
        console.log('URLs obtenidas:', data);
        setUnityUrls(data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener URLs:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUnityUrls();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          color: 'red', 
          padding: '15px', 
          backgroundColor: '#fee', 
          borderRadius: '8px',
          border: '1px solid #fcc'
        }}>
          <h3>Error al cargar el juego</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#c33',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !unityUrls) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Configurando el juego...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <UnityGame urls={unityUrls} />;
}