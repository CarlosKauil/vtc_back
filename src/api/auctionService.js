// src/api/auctionService.js

import api from './axios';

/**
 * Servicio para gestionar las operaciones de subastas
 * ✅ CORREGIDO: Todos los métodos usan la instancia 'api' con interceptor
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
   * POST /api/auctions
   */
  createAuction: async (auctionData) => {
    try {
      const response = await api.post('/auctions', auctionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      throw error;
    }
  },

  /**
   * Actualizar hora límite de subasta
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
      const response = await api.post(`/auctions/${auctionId}/finalize`);
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
      const response = await api.post(`/auctions/${auctionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar subasta:', error);
      throw error;
    }
  },

  /**
   * Obtener subastas ganadas
   * GET /api/my-won-auctions
   * ✅ CORREGIDO: Usa 'api' en lugar de 'axios'
   */
  getWonAuctions: async () => {
    try {
      const response = await api.get('/my-won-auctions');
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
      const response = await api.get('/my-bids');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis pujas:', error);
      throw error;
    }
  },

  /**
   * Alias para obtener detalle (usado en Checkout)
   */
  getAuction: async (id) => {
    return await auctionService.getAuctionById(id);
  },

  /**
   * Procesar el pago
   * POST /api/auctions/:id/pay
   * ✅ CORREGIDO: Usa 'api' en lugar de 'axios'
   */
  processPayment: async (auctionId, paymentData) => {
    try {
      const response = await api.post(
        `/auctions/${auctionId}/pay`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte administrativo
   * GET /api/admin/auctions-report
   * ✅ CORREGIDO: Usa 'api' en lugar de 'axios'
   */
  getAdminReport: async () => {
    try {
      const response = await api.get('/admin/auctions-report');
      return response.data;
    } catch (error) {
      console.error('Error admin report:', error);
      throw error;
    }
  },

  /**
   * Crear intención de pago con Stripe
   * POST /api/create-payment-intent/:id
   * ✅ CORREGIDO: Usa 'api' en lugar de 'axios'
   */
  createPaymentIntent: async (auctionId) => {
    try {
      const response = await api.post(`/create-payment-intent/${auctionId}`);
      return response.data;
    } catch (error) {
      console.error('Error creando intento de pago:', error);
      throw error;
    }
  },
};

export default auctionService;