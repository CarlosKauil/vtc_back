import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';


const MetabaseDashboard = ({ dashboardId }) => {
    const [embedUrl, setEmbedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmbedUrl = async () => {
            try {
                // Llama al endpoint de Laravel para obtener el URL seguro
                const response = await axios.get(`/api/metabase/dashboard/${dashboardId}`);
                setEmbedUrl(response.data.embedUrl);
            } catch (err) {
                console.error("Error al obtener URL de Metabase:", err);
                setError('No se pudo cargar el dashboard de Metabase.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmbedUrl();
    }, [dashboardId]);

    if (isLoading) {
        return <div>Cargando dashboard... ⏳</div>;
    }

    if (error) {
        return <div>Error: {error} 😥</div>;
    }

    return (
        <DashboardLayout>
        <div style={{ width: '100%', height: '100%' }}>
            {/* El iframe usará el URL seguro generado por Laravel */}
           <iframe
                src="http://localhost:3000/public/dashboard/ae16d335-2af7-4c06-810b-57cb58a43b55"
                width="100%"
                height="100%"
                allowtransparency="true"
            ></iframe>
        </div>
        </DashboardLayout>
    );
};

export default MetabaseDashboard;