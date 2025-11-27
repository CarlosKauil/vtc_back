import { useState } from 'react';
import { login } from '../api/auth';
import './login.css';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


import { auth } from '../firebase'; // Asegúrate de que exista este archivo
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  useDocumentTitle("Vartica | Login");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const user = data.user;
      if (user.role === 'Admin') {
        window.location.href = '/admin-home';
      } else {
        window.location.href = '/client-home';
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Enviar el token a tu backend Laravel
      const response = await fetch("http://localhost:8000/api/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión con Google');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const user = data.user;
      if (user.role === 'Admin') {
        window.location.href = '/admin-home';
      } else {
        window.location.href = '/client-home';
      }

    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="login-page-container">
      <a href=""><img src="/images/Logo-KreaVerse.webp" alt="Decoración izquierda" className="corner-img left" /></a>
      <img src="/images/Logo-GVA.webp" alt="Decoración derecha" className="corner-img right" />
      <div className="login-bg">
        <div className="login-container">
          <div className="login-logo">
            <span className="login-vartica">VARTICA</span>
            <span className="login-metaverse">Metaverse</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingrese su Correo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="login-btn-row">
              <div className="col">
                <button type="submit" className="login-btn">Iniciar sesión</button>
              </div>
              <div className="col">
                <button type="button" className="login-btn-google" onClick={handleGoogleLogin}>
                  <span className="login-google-g">G</span>
                  Iniciar sesión con Google
                </button>
              </div>
            </div>
            <div className="login-register">
              ¿No tienes una cuenta?{' '}
              <a className='link-register' href="/artist-register">Regístrate aquí</a>
            </div>
            {error && <p className="login-error">{error}</p>}
          </form>
          <div className="center">
            <a href='/' className="volver-btn" type="button">
              <span className="back-icon">&#8592;</span> Volver
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
