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

const HomeScreen = ({ navigation }) => {
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
        <TouchableOpacity
          style={s.banner}
          onPress={() => navigation.navigate('Restaurantes')}
          activeOpacity={0.85}
        >
          <Text style={s.bannerEmoji}>🍽</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>Kinal Gourmet House</Text>
            <Text style={s.bannerSub}>Explora restaurantes y haz tu pedido</Text>
          </View>
          <Text style={s.bannerArrow}>→</Text>
        </TouchableOpacity>

        {/* ── Accesos rápidos ──────────────────────────────────────────────── */}
        <Text style={s.sectionTitle}>Accesos rápidos</Text>
        <View style={s.grid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={s.gridItem}
              onPress={() => {
                if (item.tab) navigation.navigate(item.tab);
              }}
              disabled={!item.tab}
              activeOpacity={0.85}
            >
              <Text style={s.gridEmoji}>{item.emoji}</Text>
              <Text style={s.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Cerrar sesión ─────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

// "tab" es el name exacto del Tab.Screen en ClientTabs. Las que no tienen
// tab todavía (carrito, pedidos, reservaciones) quedan deshabilitadas hasta
// que esas pantallas existan, en vez de simular una navegación que no pasa nada.
const QUICK_ACTIONS = [
  { emoji: '🏠', label: 'Restaurantes', tab: 'Restaurantes' },
  { emoji: '🛒', label: 'Mi carrito', tab: null },
  { emoji: '📋', label: 'Mis pedidos', tab: 'Mis Pedidos' },
  { emoji: '📅', label: 'Reservaciones', tab: null },
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
  bannerArrow: {
    fontSize: 20,
    color: COLORS.primary,
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