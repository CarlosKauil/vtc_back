import { Link } from "react-router-dom";
import './Services.css'; // Importa el archivo de estilos

export default function Services() {
  return (
    <section id="Services">
      <main className="services">
        <div className="container">
            <div className="services-content">
                    <h2>¿Quiénes pueden unirse?</h2>

                    <div className="services-group">
                        <h3 className="parrafo-areas">       Pintores, escultores, músicos, compositores, escritores y cualquier artista que desee dar un giro innovador a la forma en que comparte su arte con el mundo.

                        </h3>
                    </div>

                    <Link to="/artist-register" className="btn-animado">
                        <span>Registrarme</span>
                        <span></span>
                    </Link>
            </div>
        </div>
      </main>
    </section>
  );
}