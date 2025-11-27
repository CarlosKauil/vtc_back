import api from './axios';

/**
 * Obtiene los datos del perfil completo del artista logueado (incluyendo datos de usuario y link generado).
 * GET /api/profile
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        // Devuelve un objeto { user, artist, link }
        return response.data;
    } catch (error) {
        console.error('Error al obtener perfil privado:', error);
        throw error;
    }
};

/**
 * Actualiza los datos del perfil del artista (alias, fecha_nacimiento, area_id, name opcional).
 * Ya NO envía 'link', el backend lo genera automáticamente.
 * PUT /api/profile
 */
export const updateProfile = async (data) => {
    try {
        // Eliminamos 'link' si está presente
        const { link, ...filteredData } = data;
        const response = await api.put('/profile', filteredData);
        return response.data; // { message, artist, user, link }
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

/**
 * Obtiene la información pública de un artista por su link único.
 * GET /api/artist/{link}
 */
export const getPublicProfile = async (link) => {
    try {
        const response = await api.get(`/artist/${link}`);
        // Devuelve { artist, obras_aceptadas, link }
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error(`Error al obtener perfil público de ${link}:`, error);
        throw error;
    }
};
