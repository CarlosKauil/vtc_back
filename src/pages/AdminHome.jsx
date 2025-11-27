// src/pages/AdminHome.jsx
import DashboardLayout from '../layouts/DashboardLayout';
import UsersCrud from './UsersCrud';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function AdminHome() {
  useDocumentTitle("Vartica | Admin Home");
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-8 px-2 md:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 text-center">
            Bienvenido, Administrador
          </h1>
          <p className="text-base md:text-lg mb-4 text-gray-600 text-center">
            Este es el dashboard como Admin.
          </p>
          <img
            src="/images/Logo-KreaVerse.webp"
            alt="Logo"
            className="w-32 md:w-56 max-w-full h-auto mx-auto mb-4"
            style={{ objectFit: "contain" }}
          />
          <div className="text-right w-full pr-2 md:pr-8 text-sm md:text-base text-gray-400">
            VARTICAMetaverse
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}