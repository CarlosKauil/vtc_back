import Header from '../components/Header';
import Info from '../components/Info';
import Services from '../components/Services';
import AreasSection from '../components/AreaSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ActiveAuctionsPreview from '../components/ActiveAuctionsPreview';
import './Landing.css';
import PricingPlans from './PricingPlans';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


export default function Landing() {
  useDocumentTitle("Inicio | Landing Page");
  return (
    <div>
      <Header />
      <Navbar />
      <Info showFooter={false} />
      <ActiveAuctionsPreview />
      <Services />
      <PricingPlans />
      <AreasSection />
      <Footer />
    </div>
  );
}

