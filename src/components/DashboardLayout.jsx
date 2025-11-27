import React from "react";

export default function Navbar({ setSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white shadow px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 w-full">
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="md:hidden p-2"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="font-bold text-base md:text-lg text-center w-full md:w-auto">
        Bienvenido{user ? `, ${user.name}` : ""}
      </div>
      <div>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 md:px-3 py-1 rounded hover:bg-red-600 text-sm md:text-base"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
}