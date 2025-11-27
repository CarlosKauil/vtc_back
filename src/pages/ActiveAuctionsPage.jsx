import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ActiveAuctionsPreview from '../components/ActiveAuctionsPreview';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ActiveAuctionsPage() {
  useDocumentTitle("Subastas Activas | Vartica");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Si tu navbar es fixed/sticky y tiene altura, agrega un pt-16 o el valor que uses */}
      <main className="flex-1 w-full pt-16 py-8 sm:py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-800 mb-7 text-center">
          Subastas activas
        </h1>
        <ActiveAuctionsPreview />
      </main>
      <Footer />
    </div>
  );
}
