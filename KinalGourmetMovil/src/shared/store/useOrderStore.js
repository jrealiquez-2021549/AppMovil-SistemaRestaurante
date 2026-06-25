/**
 * useOrderStore — KinalGourmetMovil
 * Adaptación del UseOrderStore.js del frontend web.
 * Maneja la lista de pedidos del usuario, el detalle y la cancelación.
 */
import { create } from 'zustand';
import restauranteClient from '../api/restauranteClient';

/* ── Helpers de presentación ─────────────────────────────────── */
const STATUS_LABELS = {
  PENDIENTE:      'Pendiente',
  CONFIRMADO:     'Confirmado',
  EN_PREPARACION: 'En preparación',
  LISTO:          'Listo',
  EN_CAMINO:      'En camino',
  ENTREGADO:      'Entregado',
  CANCELADO:      'Cancelado',
};

const STATUS_COLORS = {
  PENDIENTE:      { bg: '#FEF9C3', text: '#A16207' },
  CONFIRMADO:     { bg: '#DBEAFE', text: '#1D4ED8' },
  EN_PREPARACION: { bg: '#FFEDD5', text: '#C2410C' },
  LISTO:          { bg: '#DCFCE7', text: '#166534' },
  EN_CAMINO:      { bg: '#F3E8FF', text: '#7E22CE' },
  ENTREGADO:      { bg: '#D1FAE5', text: '#065F46' },
  CANCELADO:      { bg: '#FEE2E2', text: '#B91C1C' },
};

const STATUS_ICONS = {
  PENDIENTE:      '🕐',
  CONFIRMADO:     '✅',
  EN_PREPARACION: '👨‍🍳',
  LISTO:          '🔔',
  EN_CAMINO:      '🛵',
  ENTREGADO:      '🎉',
  CANCELADO:      '❌',
};

const ORDER_TYPE_LABELS = {
  EN_MESA:     '🪑 En mesa',
  PARA_LLEVAR: '🥡 Para llevar',
  DOMICILIO:   '🛵 Domicilio',
};

export const useOrderStore = create((set, get) => ({
  orders:        [],
  selectedOrder: null,
  loading:       false,
  error:         null,

  // ── Getters de presentación ──────────────────────────────────
  getStatusLabel:     (s) => STATUS_LABELS[s]     ?? s,
  getStatusColors:    (s) => STATUS_COLORS[s]     ?? { bg: '#F3F4F6', text: '#6B7280' },
  getStatusIcon:      (s) => STATUS_ICONS[s]      ?? '📋',
  getOrderTypeLabel:  (t) => ORDER_TYPE_LABELS[t] ?? t,

  // ── Obtener lista de pedidos del usuario ─────────────────────
  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const res  = await restauranteClient.get('/orders/', { params: { limit: 50 } });
      const raw  = res.data?.data;
      const data = Array.isArray(raw) ? raw : (raw?.orders ?? []);
      set({ orders: data, loading: false });
    } catch (err) {
      set({
        error:   err.response?.data?.message || 'Error al cargar los pedidos',
        loading: false,
      });
    }
  },

  // ── Obtener detalle de un pedido ─────────────────────────────
  fetchOrderById: async (id) => {
    try {
      set({ loading: true, error: null, selectedOrder: null });
      const res   = await restauranteClient.get(`/orders/${id}`);
      const order = res.data?.data ?? res.data;
      set({ selectedOrder: order, loading: false });
    } catch (err) {
      set({
        error:   err.response?.data?.message || 'Error al cargar el pedido',
        loading: false,
      });
    }
  },

  // ── Cancelar un pedido ───────────────────────────────────────
  cancelOrder: async (id) => {
    try {
      set({ loading: true, error: null });
      await restauranteClient.patch(`/orders/${id}/cancel`);
      set((s) => ({
        orders: s.orders.map((o) =>
          o._id === id ? { ...o, status: 'CANCELADO' } : o
        ),
        selectedOrder: s.selectedOrder?._id === id
          ? { ...s.selectedOrder, status: 'CANCELADO' }
          : s.selectedOrder,
        loading: false,
      }));
    } catch (err) {
      set({
        error:   err.response?.data?.message || 'Error al cancelar el pedido',
        loading: false,
      });
      throw err;
    }
  },

  clearError:         () => set({ error: null }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
}));