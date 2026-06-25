/**
 * AppHeader
 * ─────────────────────────────────────────────────────────────────
 * Barra superior global de KinalGourmetMovil.
 * Muestra: logo (logo_2.png) | ícono carrito | avatar/perfil (icon.png)
 *
 * Props:
 *   navigation  — objeto de navegación de React Navigation (requerido)
 *   dark        — bool (default true): fondo oscuro (#1A1A1A) o transparente
 *   onCartPress — callback opcional para el carrito (por ahora solo placeholder)
 *
 * Uso en HomeScreen (o cualquier screen futura):
 *   import AppHeader from '../../../shared/components/AppHeader';
 *   <AppHeader navigation={navigation} />
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/useCartStore';

// ── Assets ────────────────────────────────────────────────────
const LOGO       = require('../../../assets/logo_2.png');
const AVATAR_DEF = require('../../../assets/icon.png');

// ── Colores ───────────────────────────────────────────────────
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const WHITE  = '#FFFFFF';
const MUTED  = '#8A8680';
const BORDER = 'rgba(255,255,255,0.10)';

// ── Sub-componente: mini menú desplegable ─────────────────────
function UserMenu({ visible, onClose, onAccount, onLogout }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }),
        Animated.spring(scale,   { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 7 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 110, useNativeDriver: true }),
        Animated.timing(scale,   { toValue: 0.88, duration: 110, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Pressable style={m.backdrop} onPress={onClose}>
        {/* stopPropagation: tocar dentro del menú no lo cierra */}
        <Pressable onPress={() => {}}>
          <Animated.View style={[m.menu, { opacity, transform: [{ scale }] }]}>
            {/* Flecha decorativa apuntando hacia arriba */}
            <View style={m.arrow} />

            {/* Opción: Cuenta */}
            <TouchableOpacity style={m.item} onPress={onAccount} activeOpacity={0.7}>
              <View style={[m.itemIcon, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="user" size={14} color="#3B82F6" />
              </View>
              <View style={m.itemText}>
                <Text style={m.itemLabel}>Opciones de cuenta</Text>
                <Text style={m.itemSub}>Próximamente</Text>
              </View>
              <Feather name="chevron-right" size={14} color={MUTED} />
            </TouchableOpacity>

            <View style={m.divider} />

            {/* Opción: Cerrar sesión */}
            <TouchableOpacity style={m.item} onPress={onLogout} activeOpacity={0.7}>
              <View style={[m.itemIcon, { backgroundColor: '#FEF2F2' }]}>
                <Feather name="log-out" size={14} color="#EF4444" />
              </View>
              <View style={m.itemText}>
                <Text style={[m.itemLabel, { color: '#EF4444' }]}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Componente principal ───────────────────────────────────────
export default function AppHeader({ navigation, dark = true, onCartPress }) {
  const { user, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart   = useCartStore((s) => s.openCart);

  const [menuVisible, setMenuVisible] = useState(false);

  // Foto de perfil: si el usuario tiene una URL usarla, si no usar icon.png
  const avatarSource =
    user?.photo ? { uri: user.photo } : AVATAR_DEF;

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  const handleAccount = () => {
    setMenuVisible(false);
    // Futura navegación: navigation.navigate('Cuenta');
  };

  const handleCart = () => {
    openCart();
    if (onCartPress) {
      onCartPress();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={DARK} />

      {/* Mini menú (fuera del header para que cubra toda la pantalla) */}
      <UserMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAccount={handleAccount}
        onLogout={handleLogout}
      />

      <View style={[h.bar, dark && h.barDark]}>
        {/* ── Logo ─────────────────────────────────────────── */}
        <Image
          source={LOGO}
          style={h.logo}
          resizeMode="contain"
        />

        {/* ── Acciones derechas ─────────────────────────────── */}
        <View style={h.actions}>

          {/* Carrito */}
          <TouchableOpacity
            style={h.cartBtn}
            onPress={handleCart}
            activeOpacity={0.75}
          >
            <Feather name="shopping-cart" size={18} color={WHITE} />
            {/* Badge con cantidad — visible solo si hay items */}
            {totalItems > 0 && (
              <View style={h.badge}>
                <Text style={h.badgeText}>
                  {totalItems > 99 ? '99+' : totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Avatar + chevron */}
          <TouchableOpacity
            style={h.avatarWrap}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={avatarSource}
              style={h.avatar}
              resizeMode="cover"
            />
            <Feather
              name="chevron-down"
              size={12}
              color={WHITE}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

        </View>
      </View>
    </>
  );
}

// ── Estilos del header ─────────────────────────────────────────
const h = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: 'transparent',
  },
  barDark: {
    backgroundColor: DARK,
  },

  logo: {
    width: 110,
    height: 38,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Carrito ──────────────────────────────────────────────
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    // Sin fondo propio — ícono solo sobre el header oscuro
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: DARK,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: WHITE,
    lineHeight: 10,
  },

  // ── Avatar ───────────────────────────────────────────────
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 22,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ORANGE,
  },
});

// ── Estilos del mini menú ─────────────────────────────────────
const m = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    // Cae justo debajo del header (~52 paddingTop + 38 logo + 14 paddingBottom)
    paddingTop: 108,
    paddingRight: 16,
  },
  arrow: {
    position: 'absolute',
    top: -6,
    right: 18,
    width: 12,
    height: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    transform: [{ rotate: '45deg' }],
  },
  menu: {
    backgroundColor: WHITE,
    borderRadius: 16,
    width: 224,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText:  { flex: 1 },
  itemLabel: { fontSize: 13, fontWeight: '600', color: DARK },
  itemSub:   { fontSize: 10, color: MUTED, marginTop: 1 },
  divider:   { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginHorizontal: 14 },
});