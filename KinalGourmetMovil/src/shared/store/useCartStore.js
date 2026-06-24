import { create } from "zustand";

const cleanPrice = (p) => {
  if (p && typeof p === "object" && p.$numberDecimal) return parseFloat(p.$numberDecimal);
  return parseFloat(p) || 0;
};

export const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: "",
  orderType: "PARA_LLEVAR",
  isCartOpen: false,

  openCart:  () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addItem: (dish, restaurantId, restaurantName) => {
    const state = get();
    const price = cleanPrice(dish.price);

    if (state.restaurantId && state.restaurantId !== restaurantId) {
      set({
        items: [{ dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1 }],
        restaurantId,
        restaurantName,
      });
      return;
    }

    const existing = state.items.find((i) => i.dishId === dish._id);
    const newItems = existing
      ? state.items.map((i) => i.dishId === dish._id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...state.items, { dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1 }];

    set({ items: newItems, restaurantId, restaurantName });
  },

  removeItem: (dishId) => {
    const state = get();
    const newItems = state.items
      .map((i) => i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter((i) => i.quantity > 0);
    set({
      items: newItems,
      restaurantId:   newItems.length === 0 ? null : state.restaurantId,
      restaurantName: newItems.length === 0 ? ""   : state.restaurantName,
    });
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: "", orderType: "PARA_LLEVAR" }),

  getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
}));