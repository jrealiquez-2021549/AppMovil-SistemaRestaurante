import { create } from "zustand";

const API_URL = `${import.meta.env.VITE_RESTAURANTE_API_URL}/kinalGourmetHouse/v1/promotions`;

const getToken = () => localStorage.getItem("token");

// Bug fix: convertido de useState() a Zustand para que el estado sea global
// y no se reinicie al desmontar el componente ni al llamarlo desde distintos sitios.
export const UsePromotionStore = create((set, get) => ({
  promotions: [],
  loading: false,
  error: null,

  getPromotions: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      set({ promotions: data.data || [], loading: false });
    } catch (error) {
      set({ error: "Error al obtener promociones", loading: false });
      console.error("ERROR GET promotions:", error);
    }
  },

  createPromotion: async (promotion) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(promotion),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear promoción");
      await get().getPromotions();
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePromotion: async (id, promotion) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(promotion),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar promoción");
      await get().getPromotions();
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePromotion: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar promoción");
      await get().getPromotions();
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));