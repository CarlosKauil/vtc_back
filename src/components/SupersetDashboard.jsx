import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardLayout from "../layouts/DashboardLayout";

const DASHBOARD_ID = "65af3864-ec70-4702-96bc-5de13c1bc2ff";

const SupersetDashboard = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGuestToken = async () => {
      const res = await fetch(
        (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000") +
          "/api/preset/guest-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dashboard_id: DASHBOARD_ID }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Error ${res.status} obteniendo token`);
      }
      if (!data?.token)
        throw new Error("No se obtuvo guest token desde el backend");

      return data.token;
    };

    const embed = async () => {
      if (!containerRef.current) return;
      setLoading(true);
      setError(null);

      try {
        await embedDashboard({
          id: DASHBOARD_ID,
          supersetDomain:
            import.meta.env.VITE_SUPERSET_URL ||
            "https://60a3fe8a.us1a.app.preset.io",
          embedHost: window.location.origin || "http://localhost:5173/supersetdashboard", // fallback si null
          mountPoint: containerRef.current,
          fetchGuestToken,
          dashboardUiConfig: {
            hideTitle: false,
            hideTab: false,
            hideChartControls: true,
            filters: { visible: true, expanded: false },
          },
          iframeSandboxExtras: [
            "allow-same-origin",
            "allow-scripts",
            "allow-forms",
          ],
          referrerPolicy: "strict-origin-when-cross-origin",
        });

        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Error desconocido al cargar el dashboard");
          setLoading(false);
        }
      }
    };

    embed();

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <DashboardLayout>
      <div style={{ position: "relative", width: "100%", height: "80vh" }}>
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

        {error && (
          <div
            style={{
              color: "red",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              backgroundColor: "#ffe5e5",
              borderRadius: "0.25rem",
            }}
          >
            {error}
          </div>
        )}

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

        <div
          className="superset-container"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default SupersetDashboard;
