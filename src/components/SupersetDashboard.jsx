import React, { useEffect, useRef } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardLayout from "../layouts/DashboardLayout";

const DASHBOARD_ID = "a4fa3b91-6b74-447b-9dfb-5a595e6550a3";

const SupersetDashboard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    embedDashboard({
      id: DASHBOARD_ID,
      supersetDomain:
        import.meta.env.VITE_SUPERSET_URL || "http://localhost:8088",
      mountPoint: containerRef.current,
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
  }, []);

  return (
    <DashboardLayout>
      {/* Esto fuerza al iframe interno a estirarse sí o sí */}
      <style>
        {`
          .superset-container iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
          }
        `}
      </style>

      <div
        className="superset-container"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      />
    </DashboardLayout>
  );
};

export default SupersetDashboard;
