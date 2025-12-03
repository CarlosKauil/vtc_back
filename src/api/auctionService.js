// src/api/auctionService.js
import axios from 'axios';

// URL base de tu API Laravel
const API_URL = 'https://backend-z57u.onrender.com/api'; //https://backend-z57u.onrender.com

/**
 * Servicio para gestionar las operaciones de subastas
 */
const auctionService = {
  /**
   * Obtener todas las subastas activas
   * GET /api/auctions
   */
  getActiveAuctions: async () => {
    try {
      const response = await axios.get(`${API_URL}/auctions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener subastas:', error);
      throw error;
    }
  },

  /**
   * Obtener detalle de una subasta específica
   * GET /api/auctions/:id
   */
  getAuctionById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/auctions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener subasta ${id}:`, error);
      throw error;
    }
  },

  /**
   * Alias para compatibilidad
   */
  getAuctionDetail: async (id) => {
    return auctionService.getAuctionById(id);
  },

  /**
   * Crear una nueva subasta (requiere autenticación)
   * ✨ ACTUALIZADO: Soporta fecha_fin_custom
   * POST /api/auctions
   */
  createAuction: async (auctionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/auctions`, auctionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      throw error;
    }
  },

  /**
   * ✨ NUEVO: Actualizar hora límite de subasta
   * PATCH /api/auctions/:id/update-deadline
   */
  updateDeadline: async (auctionId, fechaFin) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/auctions/${auctionId}/update-deadline`,
        { fecha_fin: fechaFin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar hora límite:', error);
      throw error;
    }
  },

  /**
   * Realizar una puja en una subasta (requiere autenticación)
   * POST /api/auctions/:id/bid
   */
  placeBid: async (auctionId, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auctions/${auctionId}/bid`,
        { monto: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al realizar puja:', error);
      // Retornar el mensaje de error específico del backend
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  /**
   * Finalizar una subasta manualmente (requiere autenticación)
   * POST /api/auctions/:id/finalize
   */
  finalizeAuction: async (auctionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auctions/${auctionId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al finalizar subasta:', error);
      throw error;
    }
  },

  /**
   * Cancelar una subasta (requiere autenticación)
   * POST /api/auctions/:id/cancel
   */
  cancelAuction: async (auctionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auctions/${auctionId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al cancelar subasta:', error);
      throw error;
    }
  },

  /**
     * Obtener subastas ganadas
     * Corrección: Usar axios + API_URL + Token Header
     */
    getWonAuctions: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/my-won-auctions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error al obtener subastas ganadas:', error);
        throw error;
      }
    },

  /**
   * Obtener todas las pujas del usuario autenticado
   * GET /api/my-bids
   */
  getMyBids: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/my-bids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pujas:', error);
      throw error;
    }
  },

  /**
   * Alias para obtener detalle (usado en Checkout)
   * Corrección: Reutilizar getAuctionById para no repetir código
   */
  getAuction: async (id) => {
    return await auctionService.getAuctionById(id);
  },

  /**
   * Procesar el pago
   * Corrección: Usar axios + API_URL + Token Header
   */
  processPayment: async (auctionId, paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auctions/${auctionId}/pay`, 
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      throw error;
    }
  },

  getAdminReport: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/auctions-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error admin report:', error);
      throw error;
    }
  },

  // Crear intención de pago con Stripe
  createPaymentIntent: async (auctionId) => {
    try {
      const token = localStorage.getItem('token');
      // Asegúrate de usar la URL correcta de tu API
      const response = await axios.post(`${API_URL}/create-payment-intent/${auctionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creando intento de pago:', error);
      throw error;
    }
  },


};

export default auctionService;
