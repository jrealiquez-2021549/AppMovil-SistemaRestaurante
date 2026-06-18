import axios from 'axios';
import { AUTH_ENDPOINTS } from '../constants/endpoints';

// ─── Instancia de Axios para el servicio de Auth ─────────────────────────────
const authClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 s — evita que las peticiones queden colgadas
});

// ─── Peticiones públicas ─────────────────────────────────────────────────────
export const loginRequest = (data) =>
  authClient.post(AUTH_ENDPOINTS.LOGIN, data);

export const registerRequest = (data) =>
  authClient.post(AUTH_ENDPOINTS.REGISTER, data);

export const forgotPasswordRequest = (email) =>
  authClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });

export const resetPasswordRequest = (token, newPassword) =>
  authClient.post(AUTH_ENDPOINTS.RESET_PASSWORD(token), { newPassword });

export const verifyAccountRequest = (token) =>
  authClient.get(AUTH_ENDPOINTS.VERIFY(token));

// ─── Peticiones autenticadas ─────────────────────────────────────────────────
export const profileRequest = (token) =>
  authClient.get(AUTH_ENDPOINTS.PROFILE, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default authClient;
