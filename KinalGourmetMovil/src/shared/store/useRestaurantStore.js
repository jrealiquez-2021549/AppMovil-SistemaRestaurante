import { create } from "zustand";
import restauranteClient from "../api/restauranteClient";
import { RESTAURANTE_ENDPOINTS } from "../constants/endpoints";

export const useRestaurantClientStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    selectedRestaurant: null,
    loadingSelected: false,

    searchTerm: "",
    filterCategory: "Todas",
    filterFeature: null,

    getFiltered: () => {
        const { restaurants, searchTerm, filterCategory, filterFeature } = get();
        const items = Array.isArray(restaurants) ? restaurants : [];
        
        return items.filter((r) => {
            const matchSearch =
                r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.address?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchCategory =
                filterCategory === "Todas" || r.category === filterCategory;

            const matchFeature =
                !filterFeature || r.features?.[filterFeature] === true;

            return matchSearch && matchCategory && matchFeature;
        });
    },

    getCategories: () => {
        const { restaurants } = get();
        const items = Array.isArray(restaurants) ? restaurants : [];
        const cats = [...new Set(items.map((r) => r.category).filter(Boolean))];
        return ["Todas", ...cats];
    },

    getCategoryLabel: (cat) => {
        if (cat === "Todas") return "🍽 Todas";
        return cat?.replace("_", " ") ?? cat;
    },

    fetchRestaurants: async () => {
        try {
            set({ loading: true, error: null });
            const res = await restauranteClient.get(RESTAURANTE_ENDPOINTS.RESTAURANTS);
            const data = res.data?.data ?? [];
            set({ restaurants: Array.isArray(data) ? data : [], loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Error al cargar restaurantes",
                loading: false,
            });
        }
    },

    fetchRestaurantById: async (id) => {
        try {
            set({ loadingSelected: true, error: null });
            const res = await restauranteClient.get(
                RESTAURANTE_ENDPOINTS.RESTAURANT_BY_ID(id),
            );
            const data = res.data?.data ?? null;
            set({ selectedRestaurant: data, loadingSelected: false });
            return { success: true, data };
        } catch (err) {
            const message =
                err.response?.data?.message || "Error al cargar el restaurante";
            set({ error: message, loadingSelected: false });
            return { success: false, error: message };
        }
    },

    clearSelectedRestaurant: () => set({ selectedRestaurant: null }),

    setSearchTerm:     (term)    => set({ searchTerm: term }),
    setFilterCategory: (cat)     => set({ filterCategory: cat }),
    setFilterFeature:  (feature) => set({ filterFeature: feature }),
    clearFilters: () => set({ searchTerm: "", filterCategory: "Todas", filterFeature: null }),
    clearError:   () => set({ error: null }),
}));