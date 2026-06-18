import axios from 'axios';
import { RESTAURANTE_BASE } from '../constants/endpoints';
import * as SecureStore from 'expo-secure-store';

// ─── Instancia de Axios para el servicio de Restaurante ──────────────────────
const restauranteClient = axios.create({
  baseURL: RESTAURANTE_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Interceptor: adjunta el token automáticamente ───────────────────────────
restauranteClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {
      // Si SecureStore falla no bloqueamos la petición
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default restauranteClient;
