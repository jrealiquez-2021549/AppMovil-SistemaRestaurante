/**
 * useCartStore — KinalGourmetMovil
 * Adaptación del UseCartStore.js del frontend web.
 * Persistencia: AsyncStorage (equivalente a localStorage en móvil).
 * Incluye lógica de cupones (applyCoupon, removeCoupon, getFinalTotal).
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import restauranteClient from "../api/restauranteClient";

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
        items:           state.items,
        restaurantId:    state.restaurantId,
        restaurantName:  state.restaurantName,
        orderType:       state.orderType,
        deliveryAddress: state.deliveryAddress,
        deliveryPhone:   state.deliveryPhone,
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

  // ── Cupones ───────────────────────────────────────────────
  appliedCoupon:     null,
  appliedCouponCode: null,
  discountAmount:    0,
  isApplyingCoupon:  false,
  couponError:       null,

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

  // ── Cupones ───────────────────────────────────────────────
  applyCoupon: async (code, userId, restaurantId) => {
    set({ isApplyingCoupon: true, couponError: null });
    const total = get().getTotalPrice();

    try {
      const response = await restauranteClient.post("/coupons/validate", {
        code,
        userId,
        restaurantId,
        orderTotal: total,
      });

      if (response.data.success) {
        set({
          appliedCoupon:     response.data.data.coupon,
          appliedCouponCode: code,
          discountAmount:    response.data.data.estimatedDiscount,
          isApplyingCoupon:  false,
          couponError:       null,
        });
        return { success: true, message: "Cupón aplicado" };
      }

      set({ isApplyingCoupon: false });
      return { success: false, message: "Cupón inválido" };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al validar cupón";
      set({
        appliedCoupon:     null,
        appliedCouponCode: null,
        discountAmount:    0,
        isApplyingCoupon:  false,
        couponError:       msg,
      });
      return { success: false, message: msg };
    }
  },

  removeCoupon: () => set({
    appliedCoupon:     null,
    appliedCouponCode: null,
    discountAmount:    0,
    couponError:       null,
  }),

  // ── Items ─────────────────────────────────────────────────
  addItem: (dish, restaurantId, restaurantName) => {
    const state = get();
    const price = cleanPrice(dish.price);

    // Si cambia de restaurante, limpia el carrito y el cupón
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      const next = {
        ...state,
        items: [{ dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1, specialInstructions: "" }],
        restaurantId,
        restaurantName,
        appliedCoupon:     null,
        appliedCouponCode: null,
        discountAmount:    0,
        couponError:       null,
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
    set({
      ...EMPTY_CART,
      appliedCoupon:     null,
      appliedCouponCode: null,
      discountAmount:    0,
      couponError:       null,
    });
    saveCart(EMPTY_CART);
  },

  // ── Getters ───────────────────────────────────────────────
  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
  getFinalTotal: () => {
    const subtotal = get().items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    return Math.max(0, subtotal - get().discountAmount);
  },
}));