import axios from "axios";
import { Platform } from "react-native";

const BASE_URL = "https://kinal-restaurante-api.onrender.com/kinalGourmetHouse/v1";

const restauranteClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: adjunta el token antes de cada petición
restauranteClient.interceptors.request.use(async (config) => {
  try {
    let token = null;

    if (Platform.OS === "web") {
      token = localStorage.getItem("token");
    } else {
      const SecureStore = await import("expo-secure-store");
      token = await SecureStore.getItemAsync("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}

  return config;
});

export default restauranteClient;