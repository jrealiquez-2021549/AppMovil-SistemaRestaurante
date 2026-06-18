import { create } from 'zustand';
import { Platform } from 'react-native';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  profileRequest,
} from '../api/authClient';

// ─────────────────────────────────────────────────────────────────────────────
// Capa de almacenamiento segura compatible con web y móvil.
//
// expo-secure-store NO funciona en web (lanza excepción o no guarda nada).
// En web usamos localStorage como fallback; en iOS/Android usamos SecureStore.
// ─────────────────────────────────────────────────────────────────────────────
const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key) {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.deleteItemAsync(key);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// useAuthStore
// ─────────────────────────────────────────────────────────────────────────────
export const useAuthStore = create((set, get) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,
  isLoading:       false,
  error:           null,
  _hasHydrated:    false,

  // ── Restaurar sesión al abrir la app ──────────────────────────────────────
  restoreSession: async () => {
    try {
      const token = await storage.getItem('token');
      if (token) {
        try {
          const res = await profileRequest(token);
          // El backend devuelve { message, user } en /auth/profile
          set({
            user:            res.data.user,
            token,
            isAuthenticated: true,
          });
        } catch (_) {
          // Token expirado o inválido → limpiar
          await storage.deleteItem('token');
        }
      }
    } catch (err) {
      console.log('restoreSession error:', err);
    } finally {
      set({ _hasHydrated: true });
    }
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const res = await loginRequest({ email, password });

      // El backend devuelve directamente { token, user }
      const { token, user } = res.data;

      if (!token) {
        throw new Error('El servidor no devolvió un token válido');
      }

      await storage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading:       false,
        _hasHydrated:    true,
        error:           null,
      });

      return { success: true, user };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error de autenticación';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── Registro ──────────────────────────────────────────────────────────────
  register: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await registerRequest(data);

      set({ isLoading: false, error: null });

      return { success: true, data: res.data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error en el registro';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── Olvidé mi contraseña ──────────────────────────────────────────────────
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });

      const res = await forgotPasswordRequest(email);

      set({ isLoading: false });

      return { success: true, message: res.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error al enviar el correo';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── Restablecer contraseña ────────────────────────────────────────────────
  resetPassword: async (token, newPassword) => {
    try {
      set({ isLoading: true, error: null });

      await resetPasswordRequest(token, newPassword);

      set({ isLoading: false });

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error al cambiar contraseña';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── Perfil ────────────────────────────────────────────────────────────────
  getProfile: async () => {
    try {
      const { token } = get();
      const res = await profileRequest(token);
      set({ user: res.data.user });
      return res.data.user;
    } catch (err) {
      console.log('getProfile error:', err);
      await get().logout();
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await storage.deleteItem('token');
    } catch (_) {}
    set({
      user:            null,
      token:           null,
      isAuthenticated: false,
      error:           null,
      isLoading:       false,
    });
  },

  // ── Limpiar error ─────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));
