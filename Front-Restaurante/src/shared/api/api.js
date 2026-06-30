import axios from 'axios';

const createInstance = (url) => {
    const instance = axios.create({
        baseURL: url
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('[API] No hay token en localStorage. La petición irá sin Authorization.');
        }
        return config;
    });

    // Interceptor de respuesta: si llega un 401, limpiar sesión y redirigir al login
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn('[API] Token inválido o expirado. Cerrando sesión...');
                localStorage.removeItem('token');
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const axiosAuth = createInstance(import.meta.env.VITE_AUTH_API_URL);
export const axiosRestaurante = createInstance(import.meta.env.VITE_RESTAURANTE_API_URL);