import './index.css';
import 'animate.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas principales
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

// Componentes Generales
import Metaverso from './components/Metaverso';
import ObraForm from './pages/ObraForm';
import ObrasTable from './components/ObrasTable';
import MetabaseDashboard from './components/MetabaseDashboard';


import MetaversoVR from './components/MetaversoVR';

// 🧑‍🎨 Perfil del artista
// Perfil del artista

import PublicProfileView from './components/PublicProfileView'; 
import ArtistProfileForm from './components/ArtistProfileForm';

// SUBASTAS - Componentes y Páginas
import AuctionList from "./components/Auctions/AuctionList";
import AuctionDetail from "./components/Auctions/AuctionDetail";
import MyBids from "./components/Auctions/MyBids";
import CreateAuction from "./components/Auctions/CreateAuction";
import MyWonAuctions from './components/Auctions/MyWonAuctions';
import CertificatePage from './components/Auctions/CertificatePage';
import AdminAuctions from './pages/Admin/AdminAuctions';
// WonAuctionCard NO se importa aquí, es un hijo de MyWonAuctions

// CHECKOUT (FALTABA ESTA IMPORTACIÓN)
import CheckoutPage from './pages/Checkout/CheckoutPage'; 

// Otros
import AreaDetail from './pages/AreaDetail';
import ActiveAuctionsPage from './pages/ActiveAuctionsPage';
import SupersetDashboard from './components/SupersetDashboard';
import PricingPlans from './pages/PricingPlans';
import TermsAndConditions from './components/TermsAndConditions';

// Seguridad
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/land" element={<Landing />} />
        <Route path="/info" element={<Info />} />
        <Route path="/metaverso" element={<Metaverso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/artist-register" element={<ArtistRegister />} />
        <Route path="/area/:area" element={<AreaDetail />} />
        <Route path="/active-auctions" element={<ActiveAuctionsPage />} />
        <Route path="/supersetdashboard" element={<SupersetDashboard />} />
        <Route path="/pricing-plans" element={<PricingPlans />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route path="/vr" element={<MetaversoVR />} />

        {/* 🧑‍🎨 Perfil público del artista (no requiere login) */}

        
        {/* Perfil público del artista */}

        <Route path="/artist/:link" element={<PublicProfileView />} />

        {/* SUBASTAS - Rutas públicas */}
        <Route path="/auctions" element={<AuctionList />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />

        {/* Rutas protegidas - ADMIN */}
        <Route path="/admin-home" element={<PrivateRoute allowedRoles={['Admin']}><AdminHome /></PrivateRoute>} />
        <Route path="/obras-admin" element={<PrivateRoute allowedRoles={['Admin']}><ObrasAdmin /></PrivateRoute>} />
        <Route path="/obras-aceptadas" element={<PrivateRoute allowedRoles={['Admin']}><ObrasAceptadas /></PrivateRoute>} />
        <Route path="/vartica/dashboard" element={<PrivateRoute allowedRoles={['Admin']}><MetabaseDashboard dashboardId={1} /></PrivateRoute>} />
        <Route path="/Usuarios" element={<PrivateRoute allowedRoles={['Admin']}><UsersCrud /></PrivateRoute>} />
        <Route path="/Areas" element={<PrivateRoute allowedRoles={['Admin']}><AreasCrud /></PrivateRoute>} />
        <Route path="/admin/sales" element={<PrivateRoute allowedRoles={['Admin']}><AdminAuctions /></PrivateRoute>}/>
        
        {/* Subastas Admin */}
        <Route path="/auctions/create" element={<PrivateRoute allowedRoles={['Admin']}><CreateAuction /></PrivateRoute>} />

        {/* Rutas protegidas - USUARIOS Y ARTISTAS */}
        <Route path="/client-home" element={<PrivateRoute allowedRoles={['User', 'Artista']}><ClientHome /></PrivateRoute>} />
        <Route path="/create-obras" element={<PrivateRoute allowedRoles={['User', 'Artista']}><ObraForm /></PrivateRoute>} />
        <Route path="/mis-obras" element={<PrivateRoute allowedRoles={['User', 'Artista']}><ObrasTable /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute allowedRoles={['Artista', 'User']}><ArtistProfileForm /></PrivateRoute>} />
        {/* Certificado de Autenticidad */}
        <Route 
          path="/auctions/certificate/:auctionId" 
          element={
            <PrivateRoute allowedRoles={['Admin', 'User', 'Artista']}>
              <CertificatePage />
            </PrivateRoute>
          } 
        />
        
        {/* SUBASTAS - Usuario Logueado */}
        
        {/* Mis Pujas */}
        <Route path="/my-bids" element={<PrivateRoute allowedRoles={['Admin', 'User', 'Artista']}><MyBids /></PrivateRoute>} />
        
        {/* Mis Victorias (Corregido: Eliminé la ruta duplicada que usaba WonAuctionCard) */}
        <Route path="/auctions/won" element={<PrivateRoute allowedRoles={['Admin', 'User', 'Artista']}><MyWonAuctions /></PrivateRoute>} />
        
        {/* Checkout (Corregido: Ahora está protegida) */}
        <Route path="/checkout/:auctionId" element={<PrivateRoute allowedRoles={['Admin', 'User', 'Artista']}><CheckoutPage /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;