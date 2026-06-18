# Kinal Gourmet — Aplicación Móvil

Versión móvil de Kinal Gourmet House construida con **Expo (React Native)** siguiendo la arquitectura por features de KinalBankMovil.

---

## 🚀 Instalación rápida

```bash
# 1. Instalar dependencias
npm install
# o con pnpm:
pnpm install

# 2. Iniciar el servidor de desarrollo
npx expo start
```

Escanea el código QR con **Expo Go** (Android/iOS) o presiona `w` para abrir en el navegador.

---

## ⚙️ Configuración de IPs del backend

El archivo más importante a editar antes de correr en un dispositivo físico es:

```
src/shared/constants/endpoints.js
```

Cambia las IPs por la dirección de tu máquina en la red local:

```js
const AUTH_BASE = Platform.OS === 'web'
  ? 'http://localhost:3005/api'
  : 'http://TU_IP_LOCAL:3005/api';   // ← aquí

const RESTAURANTE_BASE = Platform.OS === 'web'
  ? 'http://localhost:3006'
  : 'http://TU_IP_LOCAL:3006';       // ← y aquí
```

Para encontrar tu IP en Windows: `ipconfig` → IPv4  
En Mac/Linux: `ifconfig` → inet

> El emulador de Android usa `10.0.2.2` como alias de `localhost`.  
> En ese caso reemplaza con `http://10.0.2.2:3005/api`.

---

## 📁 Estructura del proyecto

```
KinalGourmetMovil/
├── App.jsx                          # Raíz de la aplicación
├── index.js                         # Entry point de Expo
├── app.json                         # Configuración de Expo
├── babel.config.js
├── package.json
└── src/
    ├── app/
    │   └── navigation/
    │       ├── AppNavigator.jsx     # Decide auth vs. cliente
    │       ├── AuthStack.jsx        # Login → Register → ForgotPassword
    │       └── ClientTabs.jsx       # Tabs del cliente autenticado
    ├── features/
    │   ├── auth/
    │   │   └── screens/
    │   │       ├── LoginScreen.jsx
    │   │       ├── RegisterScreen.jsx
    │   │       └── ForgotPasswordScreen.jsx
    │   └── client/
    │       └── screens/
    │           └── HomeScreen.jsx   # Pantalla principal (placeholder)
    └── shared/
        ├── api/
        │   ├── authClient.js        # Axios → puerto 3005 (auth)
        │   └── restauranteClient.js # Axios → puerto 3006 (restaurante)
        ├── components/
        │   ├── Input.jsx            # Campo de texto reutilizable
        │   └── Button.jsx           # Botón reutilizable
        ├── constants/
        │   ├── theme.js             # Colores, tipografía, espaciado
        │   └── endpoints.js         # URLs de los backends
        └── store/
            └── authStore.js         # Zustand + SecureStore (sesión)
```

---

## 🔐 Flujo de autenticación

1. Al abrir la app, `AppNavigator` llama a `restoreSession()`.
2. Si hay un token en `SecureStore`, lo valida contra `/auth/profile`.
3. Si el token es válido → muestra `ClientTabs`. Si no → `AuthStack`.
4. El login guarda el token en `SecureStore` (seguro, cifrado en el dispositivo).
5. El logout elimina el token y regresa al `AuthStack`.

---

## 🏗️ Fases de desarrollo

| Fase | Estado | Descripción |
|------|--------|-------------|
| 1 | ✅ Completo | Login, Registro, Recuperar contraseña (solo vista Cliente) |
| 2 | 🔜 Pendiente | Lista de restaurantes y detalle |
| 3 | 🔜 Pendiente | Carrito y checkout |
| 4 | 🔜 Pendiente | Mis pedidos y reservaciones |
| 5 | 🔜 Pendiente | Perfil del cliente |

---

## 📦 Dependencias principales

| Paquete | Uso |
|---------|-----|
| `expo` | Framework base |
| `@react-navigation/native-stack` | Navegación de auth |
| `@react-navigation/bottom-tabs` | Tabs del cliente |
| `axios` | Peticiones HTTP al backend |
| `expo-secure-store` | Almacenamiento seguro del token |
| `zustand` | Estado global (auth) |
