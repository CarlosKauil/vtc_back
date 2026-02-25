import { useState, useEffect } from 'react';
import { artistRegister } from '../api/auth';
import { getAreas } from '../api/areas';
import './Auth.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useNavigate } from 'react-router-dom'; // para redirigir a la página de PDFs

export default function ArtistRegister() {
  useDocumentTitle("Vartica | Registro de Artista");
  const navigate = useNavigate();

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

      <div className="auth-card register">
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
            <label>Alias artístico</label>
            <input
              name="alias"
              placeholder="Alias artístico (máx. 11)"
              value={form.alias}
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

          {/* Checkbox + link que redirige a la vista de PDFs */}
          <div className="auth-field terms-field">
           
          </div>
         <div className="auth-field terms-field">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Acepto los{' '}
              <span
                className="terms-link"
                onClick={() => navigate('/terms-and-conditions')}
              >
                términos y condiciones
              </span>
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
    </div>
  );
}
