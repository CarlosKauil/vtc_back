import DashboardLayout from '../layouts/DashboardLayout';

export default function ClientHome() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-10 px-2 md:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center relative">
          {/* Fondo decorativo */}
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 opacity-50 rounded-2xl -z-10" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 text-center drop-shadow">
            Bienvenido, Artista
          </h1>
          <p className="text-base md:text-lg mb-6 text-gray-700 text-center">
            Este es el dashboard de Artista. Aquí podrás gestionar tus contenidos, consultar eventos y acceder a tus estadísticas.
          </p>
          <img
            src="/images/Logo-KreaVerse.webp"
            alt="Logo"
            className="w-32 md:w-56 max-w-full h-auto mx-auto mb-6 drop-shadow-xl"
            style={{ objectFit: "contain" }}
          />
          {/* Panel de accesos/acciones rápidas */}
          <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
            <a
              href="/perfil"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white text-center shadow-md hover:bg-indigo-700 transition font-semibold"
            >
              Perfil Artista
            </a>
            <a
              href="/events"
              className="flex-1 px-6 py-3 rounded-xl bg-pink-500 text-white text-center shadow-md hover:bg-pink-600 transition font-semibold"
            >
             Obras
            </a>
            
          </div>
          <div className="text-right w-full pr-2 md:pr-8 text-xs md:text-base text-gray-400">
            VARTICAMetaverse
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
