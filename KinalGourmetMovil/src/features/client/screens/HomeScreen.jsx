import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../../shared/store/authStore';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';

// ─── HomeScreen (Cliente) ─────────────────────────────────────────────────────
// Pantalla temporal mientras se implementa la vista completa del cliente.
// Muestra bienvenida y acceso rápido a las funcionalidades principales.
const HomeScreen = () => {
  const { user, logout, getProfile } = useAuthStore();

  useEffect(() => {
    if (!user) getProfile();
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>¡Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋</Text>
            <Text style={s.subGreeting}>¿Qué quieres ordenar hoy?</Text>
          </View>
          <TouchableOpacity style={s.avatarBtn} onPress={logout}>
            <Text style={s.avatarText}>
              {user?.name ? user.name[0].toUpperCase() : '?'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Banner principal ─────────────────────────────────────────────── */}
        <View style={s.banner}>
          <Text style={s.bannerEmoji}>🍽</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>Kinal Gourmet House</Text>
            <Text style={s.bannerSub}>Explora restaurantes y haz tu pedido</Text>
          </View>
        </View>

        {/* ── Accesos rápidos ──────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>Accesos rápidos</Text>
        <View style={s.grid}>
          {QUICK_ACTIONS.map((item) => (
            <View key={item.label} style={s.gridItem}>
              <Text style={s.gridEmoji}>{item.emoji}</Text>
              <Text style={s.gridLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Nota desarrollo ──────────────────────────────────────────────── */}
        <View style={s.devNote}>
          <Text style={s.devNoteText}>
            🚧 Esta pantalla está en desarrollo. Las funcionalidades del cliente
            (restaurantes, órdenes, reservaciones) se implementarán en la siguiente fase.
          </Text>
        </View>

        {/* ── Cerrar sesión ─────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const QUICK_ACTIONS = [
  { emoji: '🏠', label: 'Restaurantes' },
  { emoji: '🛒', label: 'Mi carrito' },
  { emoji: '📋', label: 'Mis pedidos' },
  { emoji: '📅', label: 'Reservaciones' },
];

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gray900,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.gray500,
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.md,
  },
  bannerEmoji: { fontSize: 40 },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: COLORS.gray500,
  },

  // Grid
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  gridItem: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray100,
    ...SHADOWS.sm,
  },
  gridEmoji: { fontSize: 30, marginBottom: 8 },
  gridLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray700,
    textAlign: 'center',
  },

  // Nota de desarrollo
  devNote: {
    backgroundColor: COLORS.warningLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.3)',
    marginBottom: SPACING.lg,
  },
  devNoteText: {
    fontSize: 13,
    color: COLORS.warning,
    lineHeight: 20,
  },

  // Logout
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  logoutText: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '600',
  },
});

export default HomeScreen;
