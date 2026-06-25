/**
 * useCartStore — KinalGourmetMovil
 * Adaptación del UseCartStore.js del frontend web.
 * Persistencia: AsyncStorage (equivalente a localStorage en móvil).
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "restaurant_cart";

// ── Helpers de persistencia ───────────────────────────────────
const EMPTY_CART = {
  items: [],
  restaurantId: null,
  restaurantName: "",
  orderType: "PARA_LLEVAR",
  deliveryAddress: "",
  deliveryPhone: "",
};

const loadCart = async () => {
  try {
    const raw = await AsyncStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
};

const saveCart = async (state) => {
  try {
    await AsyncStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items:          state.items,
        restaurantId:   state.restaurantId,
        restaurantName: state.restaurantName,
        orderType:      state.orderType,
        deliveryAddress: state.deliveryAddress,
        deliveryPhone:  state.deliveryPhone,
      })
    );
  } catch (_) {}
};

// ── Helper de precio ──────────────────────────────────────────
const cleanPrice = (p) => {
  if (p && typeof p === "object" && p.$numberDecimal)
    return parseFloat(p.$numberDecimal);
  return parseFloat(p) || 0;
};

// ── Store ─────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  // Estado inicial (se hidrata desde AsyncStorage al montar la app)
  ...EMPTY_CART,
  isCartOpen: false,
  _hydrated: false,

  // ── Hidratación desde AsyncStorage ────────────────────────
  hydrate: async () => {
    const saved = await loadCart();
    set({ ...saved, _hydrated: true });
  },

  // ── Drawer ────────────────────────────────────────────────
  openCart:   () => set({ isCartOpen: true }),
  closeCart:  () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  // ── Tipo de orden ─────────────────────────────────────────
  setOrderType: (type) => {
    set({ orderType: type });
    saveCart({ ...get(), orderType: type });
  },

  setDeliveryAddress: (address) => {
    set({ deliveryAddress: address });
    saveCart({ ...get(), deliveryAddress: address });
  },

  setDeliveryPhone: (phone) => {
    set({ deliveryPhone: phone });
    saveCart({ ...get(), deliveryPhone: phone });
  },

  // ── Items ─────────────────────────────────────────────────
  addItem: (dish, restaurantId, restaurantName) => {
    const state = get();
    const price = cleanPrice(dish.price);

    // Si cambia de restaurante, limpia el carrito
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      const next = {
        ...state,
        items: [{ dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1, specialInstructions: "" }],
        restaurantId,
        restaurantName,
      };
      set(next);
      saveCart(next);
      return;
    }

    const existing = state.items.find((i) => i.dishId === dish._id);
    const newItems = existing
      ? state.items.map((i) => i.dishId === dish._id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...state.items, { dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1, specialInstructions: "" }];

    const next = { ...state, items: newItems, restaurantId, restaurantName };
    set(next);
    saveCart(next);
  },

  removeItem: (dishId) => {
    const state = get();
    const newItems = state.items
      .map((i) => i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter((i) => i.quantity > 0);

    const next = {
      ...state,
      items: newItems,
      restaurantId:   newItems.length === 0 ? null : state.restaurantId,
      restaurantName: newItems.length === 0 ? ""   : state.restaurantName,
    };
    set(next);
    saveCart(next);
  },

  deleteItem: (dishId) => {
    const state = get();
    const newItems = state.items.filter((i) => i.dishId !== dishId);
    const next = {
      ...state,
      items: newItems,
      restaurantId:   newItems.length === 0 ? null : state.restaurantId,
      restaurantName: newItems.length === 0 ? ""   : state.restaurantName,
    };
    set(next);
    saveCart(next);
  },

  updateInstructions: (dishId, specialInstructions) => {
    const state = get();
    const newItems = state.items.map((i) =>
      i.dishId === dishId ? { ...i, specialInstructions } : i
    );
    const next = { ...state, items: newItems };
    set(next);
    saveCart(next);
  },

  clearCart: () => {
    set({ ...EMPTY_CART });
    saveCart(EMPTY_CART);
  },

  // ── Getters ───────────────────────────────────────────────
  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
}));