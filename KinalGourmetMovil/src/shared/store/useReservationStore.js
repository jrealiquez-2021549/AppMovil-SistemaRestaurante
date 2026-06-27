import { create } from 'zustand';
import restauranteClient from '../api/restauranteClient';

const STATUS_LABELS = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    COMPLETADA: 'Completada',
};

const STATUS_COLORS = {
    PENDIENTE: { bg: '#FEF9C3', text: '#A16207' },
    CONFIRMADA: { bg: '#DCFCE7', text: '#166534' },
    CANCELADA: { bg: '#FEE2E2', text: '#B91C1C' },
    COMPLETADA: { bg: '#DBEAFE', text: '#1D4ED8' },
};

const STATUS_ICONS = {
    PENDIENTE: '🕐',
    CONFIRMADA: '✅',
    CANCELADA: '❌',
    COMPLETADA: '🎉',
};

export const useReservationStore = create((set, get) => ({
    reservations: [],
    selectedReservation: null,
    tables: [],
    loadingTables: false,
    loading: false,
    submitting: false,
    error: null,

    getStatusLabel: (s) => STATUS_LABELS[s] ?? s,
    getStatusColors: (s) => STATUS_COLORS[s] ?? { bg: '#F3F4F6', text: '#6B7280' },
    getStatusIcon: (s) => STATUS_ICONS[s] ?? '📋',

    fetchReservations: async () => {
        try {
            set({ loading: true, error: null });
            const res = await restauranteClient.get('/reservations/', {
                params: { limit: 50 },
            });
            const raw = res.data?.data;
            const data = Array.isArray(raw) ? raw : [];
            set({ reservations: data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message ?? 'Error al cargar las reservaciones',
                loading: false,
            });
        }
    },

    fetchReservationById: async (id) => {
        try {
            set({ loading: true, error: null, selectedReservation: null });
            const res = await restauranteClient.get(`/reservations/${id}`);
            const reservation = res.data?.data ?? res.data;
            set({ selectedReservation: reservation, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message ?? 'Error al cargar la reservación',
                loading: false,
            });
        }
    },

    fetchAvailableTables: async (restaurantId) => {
        try {
            set({ loadingTables: true, tables: [] });
            const res = await restauranteClient.get('/tables/', {
                params: { restaurant: restaurantId, status: 'AVAILABLE', limit: 50 },
            });
            const raw = res.data?.data;
            const tables = Array.isArray(raw) ? raw : [];
            set({ tables, loadingTables: false });
        } catch (err) {
            set({ loadingTables: false, tables: [] });
        }
    },

    createReservation: async (payload) => {
        try {
            set({ submitting: true, error: null });
            const res = await restauranteClient.post('/reservations/create', payload);
            const newReservation = res.data?.data ?? res.data;
            set((s) => ({
                reservations: [newReservation, ...s.reservations],
                submitting: false,
            }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Error al crear la reservación';
            set({ error: msg, submitting: false });
            return { success: false, message: msg };
        }
    },

    cancelReservation: async (id) => {
        try {
            set({ loading: true, error: null });
            await restauranteClient.patch(`/reservations/${id}/status`, {
                status: 'CANCELADA',
            });
            set((s) => ({
                reservations: s.reservations.map((r) =>
                    r._id === id ? { ...r, status: 'CANCELADA' } : r
                ),
                selectedReservation:
                    s.selectedReservation?._id === id
                        ? { ...s.selectedReservation, status: 'CANCELADA' }
                        : s.selectedReservation,
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Error al cancelar la reservación';
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    clearError: () => set({ error: null }),
    clearSelectedReservation: () => set({ selectedReservation: null }),
    clearTables: () => set({ tables: [] }),
}));