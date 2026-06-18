import { Platform } from 'react-native';

// ─── URLs base por servicio ──────────────────────────────────────────────────
// En web (emulador) usamos localhost; en dispositivo físico hay que poner la IP
// de la máquina donde corre el backend (ajustar según red).
const AUTH_BASE = Platform.OS === 'web'
  ? 'http://localhost:3005/api'
  : 'http://192.168.1.100:3005/api';   // ← cambia esta IP por la tuya

const RESTAURANTE_BASE = Platform.OS === 'web'
  ? 'http://localhost:3006'
  : 'http://192.168.1.100:3006';       // ← cambia esta IP por la tuya

// ─── Auth (puerto 3005) ──────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:           `${AUTH_BASE}/auth/login`,
  REGISTER:        `${AUTH_BASE}/auth/register`,
  VERIFY:          (token) => `${AUTH_BASE}/auth/verify/${token}`,
  PROFILE:         `${AUTH_BASE}/auth/profile`,
  FORGOT_PASSWORD: `${AUTH_BASE}/auth/forgot-password`,
  RESET_PASSWORD:  (token) => `${AUTH_BASE}/auth/reset-password/${token}`,
};

// ─── Restaurante (puerto 3006) ───────────────────────────────────────────────
export const RESTAURANTE_ENDPOINTS = {
  // Restaurantes
  RESTAURANTS:        `${RESTAURANTE_BASE}/api/restaurants`,
  RESTAURANT_BY_ID:   (id) => `${RESTAURANTE_BASE}/api/restaurants/${id}`,

  // Platillos
  DISHES:             `${RESTAURANTE_BASE}/api/dishes`,
  DISH_BY_ID:         (id) => `${RESTAURANTE_BASE}/api/dishes/${id}`,

  // Órdenes
  ORDERS:             `${RESTAURANTE_BASE}/api/orders`,
  ORDER_BY_ID:        (id) => `${RESTAURANTE_BASE}/api/orders/${id}`,
  MY_ORDERS:          `${RESTAURANTE_BASE}/api/orders/my-orders`,

  // Reservaciones
  RESERVATIONS:       `${RESTAURANTE_BASE}/api/reservations`,
  MY_RESERVATIONS:    `${RESTAURANTE_BASE}/api/reservations/my-reservations`,

  // Cupones
  CUPONES:            `${RESTAURANTE_BASE}/api/coupons`,
  VALIDATE_CUPON:     `${RESTAURANTE_BASE}/api/coupons/validate`,

  // Reseñas
  REVIEWS:            `${RESTAURANTE_BASE}/api/reviews`,
};

export { AUTH_BASE, RESTAURANTE_BASE };
