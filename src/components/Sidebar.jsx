import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPalette,
  FaUser,
  FaThLarge,
  FaUsers,
  FaCompass,
  FaChartPie,
  FaGavel, // 🆕 Icono de subasta (martillo de juez)
  FaHistory, // 🆕 Icono de historial
  FaPlusCircle, // 🆕 Icono de crear
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [openObrasDropdown, setOpenObrasDropdown] = React.useState(false);
  const [openSubastasDropdown, setOpenSubastasDropdown] = React.useState(false); // 🆕 Estado para dropdown de subastas

  // Función para comprobar ruta activa
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay para móviles */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen w-64 
          bg-gradient-to-b from-gray-900 to-gray-800 
          text-white shadow-lg transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none md:flex md:flex-col
        `}
        style={{ minHeight: "120vh" }}
      >
        {/* Logo y título */}
        <div className="p-6 flex items-center gap-2 font-bold text-2xl border-b border-gray-700">
          <img src="/images/Logo-KreaVerse.webp" alt="Logo" className="h-8" />
          <span>VARTICA</span>
          <span className="text-sm font-light">Metaverse</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
          {/* 🔹 Dashboard principal */}
          <Link
            to={user?.role === "Admin" ? "/admin-home" : "/client-home"}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isActive(user?.role === "Admin" ? "/admin-home" : "/client-home")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setOpen(false)}
          >
            <FaHome size={20} />
            Dashboard - Vartica
          </Link>

          {/* 🆕 💰 SUBASTAS - Acceso público para todos */}
          <div>
            <div className="uppercase text-xs text-gray-400 mb-2 ml-1 mt-4">
              💰 Subastas
            </div>

            {/* Ver todas las subastas (público) */}
            <Link
              to="/auctions"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive("/auctions") ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setOpen(false)}
            >
              <FaGavel size={20} />
              Subastas Activas
            </Link>

            {/* Mis Pujas - Solo para usuarios autenticados */}
            {user && (
              <Link
                to="/my-bids"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/my-bids") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaHistory size={20} />
                Mis Pujas
              </Link>
            )}

            {/* Crear Subasta - Solo para Admin */}
            {user?.role === "Admin" && (
              <Link
                to="/auctions/create"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/auctions/create")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaPlusCircle size={20} />
                Crear Subasta
              </Link>
            )}
          </div>

          {/* 🎨 Menús para Artista */}
          {user?.role === "Artista" && (
            <div>
              <div className="uppercase text-xs text-gray-400 mb-2 ml-1 mt-4">
                Menús del Artista
              </div>

              <Link
                to="/mis-obras"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/mis-obras") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaPalette size={20} />
                Gestionar mis obras
              </Link>

              {/* 🧑‍🎨 Perfil del artista */}
              <Link
                to="/perfil"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/perfil") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaUser size={20} />
                Mi perfil artístico
              </Link>

              {/* 🔗 Enlace directo a su perfil público */}
              {user?.artist_link && (
                <Link
                  to={`/artist/${user.artist_link}`}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    location.pathname === `/artist/${user.artist_link}`
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <FaUser size={20} />
                  Ver perfil público
                </Link>
              )}
            </div>
          )}

          {/* 🧠 Menús para Admin */}
          {user?.role === "Admin" && (
            <div>
              <div className="uppercase text-xs text-gray-400 mb-2 ml-1 mt-4">
                Menús del Administrador
              </div>

              {/* Dashboard de datos */}
              <Link
                to="/vartica/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/vartica/dashboard")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaChartPie size={20} />
                Dashboard de Datos
              </Link>

              {/* Dropdown de Obras */}
              <div className="relative">
                <button
                  type="button"
                  className={`flex items-center gap-3 p-3 rounded-lg w-full transition ${
                    location.pathname.startsWith("/obras")
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setOpenObrasDropdown((prev) => !prev)}
                >
                  <FaPalette size={20} />
                  Obras
                  <svg
                    className={`ml-auto transition-transform ${
                      openObrasDropdown ? "rotate-180" : ""
                    }`}
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 6l6 6 6-6" />
                  </svg>
                </button>

                {openObrasDropdown && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    <Link
                      to="/obras-admin"
                      className={`flex items-center gap-2 p-2 rounded transition ${
                        isActive("/obras-admin")
                          ? "bg-gray-600"
                          : "hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setOpen(false);
                        setOpenObrasDropdown(false);
                      }}
                    >
                      Gestionar obras
                    </Link>
                    <Link
                      to="/obras-aceptadas"
                      className={`flex items-center gap-2 p-2 rounded transition ${
                        isActive("/obras-aceptadas")
                          ? "bg-gray-600"
                          : "hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setOpen(false);
                        setOpenObrasDropdown(false);
                      }}
                    >
                      Obras aceptadas
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/usuarios"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/usuarios") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaUsers size={20} />
                Gestionar Usuarios
              </Link>

              <Link
                to="/areas"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/areas") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaThLarge size={20} />
                Gestionar Áreas
              </Link>
            </div>
          )}

          {/* 🌍 Menús para User (explorador) */}
          {user?.role === "User" && (
            <div>
              <div className="uppercase text-xs text-gray-400 mb-2 ml-1 mt-4">
                Menús del Usuario
              </div>

              <Link
                to="/explorar"
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive("/explorar") ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                <FaCompass size={20} />
                Explorar artistas
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 text-xs text-gray-500 mt-auto">© 2025 VARTICA</div>
      </aside>
    </>
  );
}
