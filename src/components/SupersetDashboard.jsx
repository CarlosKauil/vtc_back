import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardLayout from "../layouts/DashboardLayout";

const DASHBOARD_ID = "fd5edd51-8ac5-427e-b211-7f53d9015d32";

const SupersetDashboard = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const embed = async () => {
      try {
        setLoading(true);
        setError(null);

        await embedDashboard({
          id: DASHBOARD_ID,
          supersetDomain:
            import.meta.env.VITE_SUPERSET_URL || "http://vartica.uiacreative.xyz",
          mountPoint: containerRef.current,
          // --- TU LÓGICA DE FETCH EXACTA ---
          fetchGuestToken: async () => {
            const res = await fetch(
              (import.meta.env.VITE_BACKEND_URL || "http://localhost:8000") +
                "/api/superset/guest-token"
            );

            if (!res.ok) {
              throw new Error("No se pudo obtener guest token");
            }

            const data = await res.json();
            return data.token;
          },
          // -------------------------------
          dashboardUiConfig: {
            hideTitle: false,
            hideTab: false,
            hideChartControls: true,
            filters: {
              visible: true,
              expanded: false,
            },
          },
          iframeSandboxExtras: [
            "allow-top-navigation",
            "allow-popups-to-escape-sandbox",
          ],
          referrerPolicy: "strict-origin-when-cross-origin",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error embedding dashboard:", err);
        setError("Error al cargar el dashboard. Verifique su conexión.");
        setLoading(false);
      }
    };

    embed();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ position: "relative", width: "100%", height: "calc(100vh - 64px)" }}>
        
        {/* Estilos del diseño solicitado */}
        <style>
          {`
            .superset-container iframe {
              width: 100% !important;
              height: 100% !important;
              border: none !important;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* UI de Error */}
        {error && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              color: "#721c24",
              padding: "0.75rem 1.25rem",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "0.25rem",
            }}
          >
            {error}
          </div>
        )}

        {/* UI de Loading (Spinner) */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #1B3C53",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "0.5rem",
              }}
            />
            <p style={{ color: "#1B3C53", fontSize: "0.875rem" }}>
              Cargando dashboard...
            </p>
          </div>
        )}

        {/* Contenedor del Dashboard */}
        <div
          className="superset-container"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default SupersetDashboard;