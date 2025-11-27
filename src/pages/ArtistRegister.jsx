import { useState, useEffect } from 'react';
import { artistRegister } from '../api/auth';
import { getAreas } from '../api/areas';
import './Auth.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


export default function ArtistRegister() {
  useDocumentTitle("Vartica | Registro de Artista");
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    alias: '',
    fecha_nacimiento: '',
    area_id: '',
  });

  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false); // ✅ nuevo estado para modal

  useEffect(() => {
    getAreas().then(setAreas);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'name' && value.length > 11) {
      setForm({ ...form, [name]: value.slice(0, 11) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    try {
      await artistRegister(form);
      setSuccess('¡Artista registrado con éxito!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar artista');
    }
  };

  return (
    <div className="auth-page-container">
      <img src="/images/Logo-KreaVerse.webp" alt="Decoración izquierda" className="corner-img left" />
      <img src="/images/Logo-GVA.webp" alt="Decoración derecha" className="corner-img right" />

      <div className={`auth-card register ${showTerms ? 'blurred' : ''}`}>
        <div className="auth-logo">
          <img src="/images/vartica.webp" alt="Título del logotipo" className="title-img" />
        </div>

        <form onSubmit={handleSubmit} className="auth-form-grid">
          <div className="auth-field">
            <label>Nombre completo</label>
            <input
              name="name"
              placeholder="Nombre completo (máx. 11)"
              value={form.name}
              onChange={handleChange}
              required
              maxLength="11"
            />
          </div>

          <div className="auth-field">
            <label>Correo electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Confirmar contraseña</label>
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirmar contraseña"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Área</label>
            <select
              name="area_id"
              value={form.area_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label>Fecha de nacimiento</label>
            <input
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ Checkbox + botón para abrir modal */}
          <div className="auth-field terms-field">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Acepto los{' '}
              <button
                type="button"
                className="terms-link"
                onClick={() => setShowTerms(true)}
              >
                términos y condiciones
              </button>
            </label>
          </div>

          <div className="register-actions">
            <button
              type="button"
              className="btn-link"
              onClick={() => (window.location.href = '/login')}
            >
              Ya tengo cuenta
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!acceptedTerms}
            >
              Registrarse
            </button>
          </div>
        </form>

        {success && (
          <div className="auth-success">
            <span>✅</span>
            <p>{success}</p>
          </div>
        )}
        {error && <p className="auth-error">{error}</p>}
      </div>

      {/* ✅ Modal de términos y condiciones */}
      {showTerms && (
        <div className="terms-modal-overlay">
          <div className="terms-modal">
            <button
              className="terms-close"
              onClick={() => setShowTerms(false)}
            >
              ✕
            </button>
            <h2>Términos y Condiciones</h2>
            <div className="terms-content">
              <p>
                Bienvenido/a. Al registrarte aceptas las políticas de uso de la
                plataforma, confidencialidad de datos y los compromisos
                establecidos con la comunidad de artistas.  
                <br /><br />
                Este texto puede reemplazarse por el contenido real del
                documento de términos y condiciones.  
                <br /><br />
                Si no estás de acuerdo, puedes cerrar esta ventana y continuar
                explorando sin registrarte.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
