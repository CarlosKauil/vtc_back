import { Link } from 'react-router-dom';

export default function ArtistaDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Artista</h1>
      <div>
        <Link to="/subir-obra">Subir nueva obra</Link>
      </div>
      <div>
        <Link to="/mis-obras">Ver mis obras</Link>
      </div>
      {/* Puedes agregar más opciones aquí */}
    </div>
  );
}