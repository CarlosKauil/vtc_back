// src/api/auctionService.js

import api from './axios';


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
      const response = await api.get('/auctions');
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
      const response = await api.get(`/auctions/${id}`);
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
      // ✅ Sin headers redundantes - el interceptor lo hace
      const response = await api.post('/auctions', auctionData);
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
      const response = await api.patch(
        `/auctions/${auctionId}/update-deadline`,
        { fecha_fin: fechaFin }
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
      const response = await api.post(
        `/auctions/${auctionId}/bid`,
        { monto: parseFloat(amount) }
      );
      return response.data;
    } catch (error) {
      console.error('Error al realizar puja:', error);
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
      const response = await api.post(`/auctions/${auctionId}/finalize`, {});
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
      const response = await api.post(`/auctions/${auctionId}/cancel`, {});
      return response.data;
    } catch (error) {
      console.error('Error al cancelar subasta:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las pujas del usuario autenticado
   * GET /api/my-bids
   */
  getMyBids: async () => {
   try {
      const response = await api.get('/my-bids');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pujas:', error);
      throw error;
    }
  },
};

export default auctionService;
