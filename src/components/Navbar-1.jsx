import React, { useState, useEffect } from "react";
import { getRejectionMessages, getPendingObras } from "../api/obras";

// Constante de tiempo para el polling (30 segundos para más rapidez)
const POLLING_INTERVAL = 30000;

// Ícono de Campana (Bell) para las notificaciones
const NotificationIcon = ({ count, className = "w-6 h-6" }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.33A8.967 8.967 0 0 1 18 13.5a8.967 8.967 0 0 1-3.25-6.917A8.967 8.967 0 0 1 18 0a8.967 8.967 0 0 1 3.25 6.583A8.967 8.967 0 0 1 18 13.5a8.967 8.967 0 0 1-3.143 3.582ZM15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse min-w-[18px]">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </div>
);

export default function Navbar({ setSidebarOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [rejectionMessages, setRejectionMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Mensajes de rechazo vistos (Artista)
  const [seenMessages, setSeenMessages] = useState(() => {
    const json = localStorage.getItem('seenRejectionMessages');
    return json ? JSON.parse(json) : [];
  });

  // -- Admin: Obras pendientes recibidas --
  const [pendingObras, setPendingObras] = useState([]);
  const [showPendings, setShowPendings] = useState(false);
  const [seenPendingObras, setSeenPendingObras] = useState(() => {
    const json = localStorage.getItem('seenPendingObras');
    return json ? JSON.parse(json) : [];
  });
  const [isLoadingPendings, setIsLoadingPendings] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isArtist = user?.role === 'Artista';
  const isAdmin = user?.role === 'Admin';

  // API fetch rechazo
  const fetchMessages = async () => {
    if (!isArtist) return;
    setIsLoadingMessages(true);
    try {
      const data = await getRejectionMessages(); 
      setRejectionMessages(data);
    } catch (error) {
      console.error("Error al cargar mensajes de rechazo:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // API fetch pendings
  const fetchPendingObras = async () => {
    if (!isAdmin) return;
    setIsLoadingPendings(true);
    try {
      const data = await getPendingObras();
      setPendingObras(data);
    } catch (error) {
      console.error("Error al cargar obras pendientes:", error);
    } finally {
      setIsLoadingPendings(false);
    }
  };

  // Artist notifications
  useEffect(() => {
    if (isArtist && user?.id) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isArtist, user?.id]);

  // Admin notifications
  useEffect(() => {
    if (isAdmin && user?.id) {
      fetchPendingObras();
      const intervalId = setInterval(fetchPendingObras, POLLING_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isAdmin, user?.id]);

  // Cierra el menú si se hace clic fuera (ambos)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-menu-container')) {
        setShowNotifications(false);
      }
      if (showPendings && !event.target.closest('.pending-menu-container')) {
        setShowPendings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showPendings]);

  // Actualizar vistos al abrir notificaciones
  const handleOpenNotifications = () => {
    setShowNotifications(true);
    const newSeen = [
      ...new Set([
        ...seenMessages,
        ...rejectionMessages.map(m => m.id),
      ])
    ];
    setSeenMessages(newSeen);
    localStorage.setItem('seenRejectionMessages', JSON.stringify(newSeen));
  };
  // Actualizar vistos admin
  const handleOpenPending = () => {
    setShowPendings(true);
    const newSeen = [
      ...new Set([
        ...seenPendingObras,
        ...pendingObras.map(o => o.id),
      ])
    ];
    setSeenPendingObras(newSeen);
    localStorage.setItem('seenPendingObras', JSON.stringify(newSeen));
  };

  // Calcula no vistos
  const unreadCount = rejectionMessages.filter(m => !seenMessages.includes(m.id)).length;
  const unreadPendings = pendingObras.filter(o => !seenPendingObras.includes(o.id)).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("seenRejectionMessages");
    localStorage.removeItem("seenPendingObras");
    window.location.href = "/login";
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleRefreshNotifications = () => {
    fetchMessages();
  };

  const handleRefreshPendings = () => {
    fetchPendingObras();
  };

  return (
    <>
      <header className="flex items-center justify-between bg-[#34405a] text-white shadow-2xl border-b border-[#232c3d] px-4 md:px-8 py-3 sticky top-0 z-50 w-full">
        {/* Sección izquierda */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded bg-[#232c3d] hover:bg-[#2e3a53] transition"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="font-bold text-sm md:text-lg tracking-wide whitespace-nowrap">
            Bienvenido{user ? `, ${user.name}` : ""}
          </div>
        </div>

        {/* Sección derecha: Notificaciones + Cerrar sesión */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Admin: Obras pendientes */}
          {isAdmin && (
            <div className="relative pending-menu-container">
              <button
                onClick={handleOpenPending}
                className="p-2 rounded-full hover:bg-[#2e3a53] transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
                title={`Tienes ${unreadPendings} obras nuevas pendientes por revisar.`}
              >
                <NotificationIcon count={unreadPendings} />
              </button>
              {showPendings && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white text-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                  <div className="p-3 border-b font-semibold text-sm flex justify-between items-center bg-gray-50">
                    <span className="text-gray-800">Obras nuevas para revisión</span>
                    <button
                      onClick={handleRefreshPendings}
                      disabled={isLoadingPendings}
                      className={`text-blue-500 hover:text-blue-700 transition p-1 rounded ${isLoadingPendings ? 'animate-spin' : ''}`}
                      title="Refrescar"
                    >🔄</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {isLoadingPendings ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        <p className="text-xs text-gray-500 mt-2">Cargando...</p>
                      </div>
                    ) : pendingObras.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">No hay obras nuevas pendientes</p>
                      </div>
                    ) : (
                      pendingObras.map((obra) => (
                        <div key={obra.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-yellow-700 truncate">
                                Obra: "{obra.nombre}"
                              </p>
                              <p className="text-xs text-gray-700 mt-1">{obra.user?.name} — {obra.area?.nombre}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{new Date(obra.created_at).toLocaleString('es-MX')}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón de Notificaciones (Solo para Artistas) */}
          {isArtist && (
            <div className="relative notification-menu-container">
              <button
                onClick={handleOpenNotifications}
                className="p-2 rounded-full hover:bg-[#2e3a53] transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                title={`Tienes ${unreadCount} notificaciones de rechazo.`}
              >
                <NotificationIcon count={unreadCount} />
              </button>
              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white text-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                  <div className="p-3 border-b font-semibold text-sm flex justify-between items-center bg-gray-50">
                    <span className="text-gray-800">Notificaciones de Rechazo</span>
                    <button
                      onClick={handleRefreshNotifications}
                      disabled={isLoadingMessages}
                      className={`text-blue-500 hover:text-blue-700 transition p-1 rounded ${isLoadingMessages ? 'animate-spin' : ''}`}
                      title="Refrescar notificaciones"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {isLoadingMessages ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <p className="text-xs text-gray-500 mt-2">Cargando...</p>
                      </div>
                    ) : rejectionMessages.length === 0 ? (
                      <div className="p-6 text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm text-gray-500">No tienes notificaciones nuevas</p>
                      </div>
                    ) : (
                      rejectionMessages.map((msg) => (
                        <div key={msg.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-red-600 truncate">
                                Obra "{msg.obra?.nombre || 'Desconocida'}" rechazada
                              </p>
                              <p className="text-xs text-gray-700 mt-1 line-clamp-2">{msg.mensaje}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(msg.created_at).toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón de Cerrar Sesión */}
          {user && (
            <button
              onClick={confirmLogout}
              className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-red-600 text-xs md:text-sm transition shadow-md whitespace-nowrap flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          )}
        </div>
      </header>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all animate-[scale-in_0.2s_ease-out]">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                ¿Cerrar sesión?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que quieres cerrar tu sesión? Tendrás que iniciar sesión nuevamente para acceder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Sí, cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
