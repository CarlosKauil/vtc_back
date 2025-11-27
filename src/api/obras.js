import api from './axios';

// Subir obra (formulario multipart)
export const subirObra = async (formData) => {
    try {
        const res = await api.post('/obras', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Desestructuramos lo que devuelve Laravel
        const { message, obra, obras_aceptadas, contador } = res.data;

        return {
            message,
            obra,
            obrasAceptadas: obras_aceptadas || [],
            contador: contador || {},
        };
    } catch (error) {
        console.error("Error al subir obra:", error.response?.data || error.message);
        throw error;
    }
};

// Listar obras (Admin o Artista, con filtro opcional)
export const getObras = async (estatusId = null) => {
    try {
        let url = '/obras';
        if (estatusId !== null) {
            url += `?estatus_id=${estatusId}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener obras:', error);
        // Devolvemos un array vacío o relanzamos el error si prefieres manejarlo en el componente
        throw error;
    }
};

// Ver detalles de una obra
export const getObra = async (id) => {
    const res = await api.get(`/obras/${id}`);
    return res.data;
};

// Actualizar estatus (admin)
export const actualizarObra = async (id, data) => {
    try {
        const response = await api.put(`/obras/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar obra:', error);
        throw error;
    }
};

/**
 * NUEVO: Elimina una obra por su ID.
 * Mapea al método destroy() del ObraController.
 * @param {number} id - ID de la obra a eliminar.
 */
export const deleteObra = async (id) => {
    try {
        // Axios lanza automáticamente un error para respuestas 4xx/5xx
        // Si tiene éxito, devolverá 204 No Content, que Axios maneja bien.
        const response = await api.delete(`/obras/${id}`);
        return response.data; // Normalmente será un objeto vacío o undefined para 204
    } catch (error) {
        // Capturamos errores de permiso (403) o errores de servidor
        console.error(`Error al eliminar obra ${id}:`, error.response?.data?.message || error.message);
        throw error;
    }
};
// Obtener mensajes de rechazo para el artista (NUEVO - Soluciona el error reportado)
export const getRejectionMessages = async () => {
    try {
        // Llama al endpoint de Laravel para obtener mensajes del usuario autenticado
        const response = await api.get('/notifications/rejections'); 
        return response.data;
    } catch (error) {
        console.error('Error al obtener mensajes de rechazo:', error);
        throw error;
    }
};


// Listar obras públicas aceptadas por Área (usando el endpoint que creaste)
export const getObrasAceptadasPublic = async (areaId) => {
    try {
        // Tu endpoint es /api/obras/aceptadas/area_id
        const res = await api.get(`/obras/aceptadas/${areaId}`); 
        return res.data;
    } catch (error) {
        console.error('Error al obtener obras públicas aceptadas:', error);
        return [];
    }
};

export const getPendingObras = async () => {
  const res = await api.get('/obras-pendientes');
  return res.data;
};

/* Funciones de listado específicas (opcional, pueden simplificarse usando getObras(id)) */

// Listar obras pendientes (Mantenido, pero se recomienda usar getObras(1))
export const getObrasPendientes = async () => {
    const res = await api.get('/obras/pendientes'); // Asumiendo que esta ruta existe en tu backend
    return res.data;
};

// Listar obras aceptadas (Mantenido, pero se recomienda usar getObras(2))
export const getObrasAceptadas = async () => {
    const response = await api.get('/obras/aceptadas'); // Asumiendo que esta ruta existe en tu backend
    return response.data;
};