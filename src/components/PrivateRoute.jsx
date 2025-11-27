// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
/**
 * Componente de ruta privada que verifica si el usuario está autenticado
 * y si tiene el rol permitido para acceder a la ruta.
 */


export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si el usuario no tiene el rol permitido, redirige a su home
    if (user.role === 'Admin') return <Navigate to="/admin-home" />;
    return <Navigate to="/client-home" />;
  }

  return children;
}
