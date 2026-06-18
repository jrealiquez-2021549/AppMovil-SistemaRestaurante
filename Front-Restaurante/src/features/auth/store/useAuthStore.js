import { create } from 'zustand'
import { loginRequest, registerRequest, profileRequest } from '../../../shared/api/auth'

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

    login: async (data) => {
        try {
        set({ loading: true, error: null })

        const res = await loginRequest(data)

        localStorage.setItem('token', res.data.token)

        // Verificar si el admin restaurante tiene restaurante asignado
        const user = res.data.user
        const role = user?.Role?.name || user?.role?.name || user?.role
        const restaurantId = user?.restaurantId

        if (role === 'ADMIN_RESTAURANTE' && !restaurantId) {
            localStorage.removeItem('token')
            set({
                error: 'Tu cuenta no tiene un restaurante asignado. Contacta al administrador.',
                loading: false
            })
            return { success: false }
        }

        set({
            user: res.data.user,
            token: res.data.token,
            loading: false
        })

        return { 
            success: true, 
            user: res.data.user 
        }

        } catch (err) {
        set({
            error: err.response?.data?.message || 'Error en login',
            loading: false
        })
        }
    },

    register: async (data) => {
        try {
            set({ loading: true, error: null })

            const res = await registerRequest(data)

            set({ loading: false })

            return {
                success: true,
                data: res.data
            }

        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error en registro',
                loading: false
            })

            return { success: false }
        }
    },

    getProfile: async () => {
        try {
        const res = await profileRequest()
        set({ user: res.data.user })
        } catch (error) {
        localStorage.removeItem('token')
        set({ user: null, token: null })
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
    }
}))