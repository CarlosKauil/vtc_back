
import './Home.css'; // Importa el archivo de estilos
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-400 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Bienvenido al Sistema</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/login"
                className="block w-full text-center py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link 
                to="/register"
                className="block w-full text-center py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
              >
                Registro de usuario
              </Link>
            </li>
            <li>
              <Link 
                to="/artist-register"
                className="block w-full text-center py-2 px-4 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition"
              >
                Autoregistro de artista
              </Link>
            </li>
            <li>
              <Link 
                to="/areas"
                className="block w-full text-center py-2 px-4 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                CRUD de Áreas
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
