import PDFViewer from "./PDFViewer";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 text-gray-200 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
              Documentos Legales
            </h1>
            <p className="text-blue-200/70">Revisa nuestros términos y políticas</p>
          </div>

          {/* Grid de PDFs */}
          <div className="grid md:grid-cols-2 gap-8">
            <PDFViewer
              title="Términos y Condiciones"
              pdfUrl="/assets/TERMINOS-Y-CONDICIONES.pdf"
            />
            <PDFViewer
              title="Aviso de Privacidad"
              pdfUrl="/assets/AVISO-DE-PRIVACIDAD.pdf"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
