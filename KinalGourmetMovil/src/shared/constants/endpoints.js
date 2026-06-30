import { Platform } from 'react-native';

const AUTH_BASE = 'https://kinal-auth-api.onrender.com/api';
const RESTAURANTE_BASE = 'https://kinal-restaurante-api.onrender.com';

export const AUTH_ENDPOINTS = {
  LOGIN:           `${AUTH_BASE}/auth/login`,
  REGISTER:        `${AUTH_BASE}/auth/register`,
  VERIFY:          (token) => `${AUTH_BASE}/auth/verify/${token}`,
  PROFILE:         `${AUTH_BASE}/auth/profile`,
  FORGOT_PASSWORD: `${AUTH_BASE}/auth/forgot-password`,
  RESET_PASSWORD:  (token) => `${AUTH_BASE}/auth/reset-password/${token}`,
};

export const RESTAURANTE_ENDPOINTS = {
  // Restaurantes
  RESTAURANTS:        `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/restaurants`,
  RESTAURANT_BY_ID:   (id) => `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/restaurants/${id}`,

  // Platillos
  DISHES:             `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/dishes`,
  DISH_BY_ID:         (id) => `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/dishes/${id}`,

  // Órdenes
  ORDERS:             `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/orders`,
  ORDER_BY_ID:        (id) => `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/orders/${id}`,
  MY_ORDERS:          `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/orders/my-orders`,

  // Reservaciones
  RESERVATIONS:       `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/reservations`,
  MY_RESERVATIONS:    `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/reservations/my-reservations`,

  // Cupones
  CUPONES:            `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/coupons`,
  VALIDATE_CUPON:     `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/coupons/validate`,

  // Reseñas
  REVIEWS:            `${RESTAURANTE_BASE}/kinalGourmetHouse/v1/reviews`,
};

export { AUTH_BASE, RESTAURANTE_BASE };