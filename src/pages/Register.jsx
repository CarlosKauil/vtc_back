// src/pages/Register.jsx
import { useState } from 'react';
import { register } from '../api/auth/';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form.name, form.email, form.password);
      setSuccess('¡Usuario registrado con éxito!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div>
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required /><br />
        <button type="submit">Registrar</button>
      </form>
      {success && <p style={{color: 'green'}}>{success}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}