import './index.css';
import 'animate.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 🏠 Páginas principales
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtistRegister from './pages/ArtistRegister';
import AdminHome from './pages/AdminHome';
import ClientHome from './pages/ClientHome';
import UsersCrud from './pages/UsersCrud';
import ObrasAdmin from './pages/ObrasAdmin';
import AreasCrud from './pages/AreasCrud';
import ObrasAceptadas from './pages/ObrasAceptadas';
import Landing from './pages/Landing';
import Info from './components/Info';

// 🎨 Componentes
import Metaverso from './components/Metaverso';
import ObraForm from './pages/ObraForm';
import ObrasTable from './components/ObrasTable';
import MetabaseDashboard from './components/MetabaseDashboard';

// 🧑‍🎨 Perfil del artista
import PublicProfileView from './components/PublicProfileView'; 
import ArtistProfileForm from './components/ArtistProfileForm';

// 🆕🎨 💰 SUBASTAS - Componentes nuevos
import AuctionList from "./components/Auctions/AuctionList";
import AuctionDetail from "./components/Auctions/AuctionDetail";
import MyBids from "./components/Auctions/MyBids";
import CreateAuction from "./components/Auctions/CreateAuction";

//
import AreaDetail from './pages/AreaDetail';

import ActiveAuctionsPage from './pages/ActiveAuctionsPage';

// 🔐 Rutas protegidas
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/land" element={<Landing />} />
        <Route path="/info" element={<Info />} />
        <Route path="/metaverso" element={<Metaverso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/artist-register" element={<ArtistRegister />} />
        <Route path="/area/:area" element={<AreaDetail />} />
        <Route path="/active-auctions" element={<ActiveAuctionsPage />} />


        {/* 🧑‍🎨 Perfil público del artista (no requiere login) */}
        <Route path="/artist/:link" element={<PublicProfileView />} />

        {/* 🆕 💰 SUBASTAS - Rutas públicas */}
        {/* Cualquier persona puede ver las subastas activas */}
        <Route path="/auctions" element={<AuctionList />} />
        
        {/* Cualquier persona puede ver el detalle de una subasta */}
        <Route path="/auctions/:id" element={<AuctionDetail />} />

        {/* 🔒 Rutas protegidas - ADMIN */}
        <Route
          path="/admin-home"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminHome />
            </PrivateRoute>
          }
        />

        <Route
          path="/obras-admin"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <ObrasAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/obras-aceptadas"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <ObrasAceptadas />
            </PrivateRoute>
          }
        />

        <Route
          path="/vartica/dashboard"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <MetabaseDashboard dashboardId={1} />
            </PrivateRoute>
          }
        />

        <Route
          path="/Usuarios"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <UsersCrud />
            </PrivateRoute>
          }
        />

        <Route
          path="/Areas"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AreasCrud />
            </PrivateRoute>
          }
        />

        {/* 🆕 💰 SUBASTAS - Solo Admin puede crear subastas */}
        <Route
          path="/auctions/create"
          element={
            <PrivateRoute allowedRoles={['Admin']}>
              <CreateAuction />
            </PrivateRoute>
          }
        />

        {/* 🔒 Rutas protegidas - USUARIOS Y ARTISTAS */}
        <Route
          path="/client-home"
          element={
            <PrivateRoute allowedRoles={['User', 'Artista']}>
              <ClientHome />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-obras"
          element={
            <PrivateRoute allowedRoles={['User', 'Artista']}>
              <ObraForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/mis-obras"
          element={
            <PrivateRoute allowedRoles={['User', 'Artista']}>
              <ObrasTable />
            </PrivateRoute>
          }
        />

        {/* 👤 Perfil del artista (panel privado de edición) */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute allowedRoles={['Artista', 'User']}>
              <ArtistProfileForm />
            </PrivateRoute>
          }
        />

        {/* 🆕 💰 SUBASTAS - Usuarios autenticados pueden ver sus pujas */}
        <Route
          path="/my-bids"
          element={
            <PrivateRoute allowedRoles={['Admin', 'User', 'Artista']}>
              <MyBids />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
