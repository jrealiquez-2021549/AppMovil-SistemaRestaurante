import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../shared/store/authStore';

const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';

const QUICK_ACTIONS = [
  { icon: 'home',          label: 'Restaurantes', tab: 'Restaurantes' },
  { icon: 'shopping-cart', label: 'Mi carrito',   tab: null },
  { icon: 'file-text',     label: 'Mis pedidos',  tab: 'Mis Pedidos' },
  { icon: 'calendar',      label: 'Reservaciones', tab: null },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout, getProfile } = useAuthStore();

  useEffect(() => {
    if (!user) getProfile();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : '';
  const initial   = user?.name ? user.name[0].toUpperCase() : '?';

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header oscuro ─────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.wordmark}>
              Kinal<Text style={s.wordmarkDot}>.</Text>
            </Text>
            <TouchableOpacity
              style={s.avatar}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Text style={s.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.greeting}>Bienvenido de vuelta</Text>
          <Text style={s.name}>
            ¡Hola, <Text style={s.nameAccent}>{firstName || 'Usuario'}</Text>! 👋
          </Text>
        </View>

        <View style={s.body}>
          {/* ── Banner ────────────────────────────────────────────── */}
          <TouchableOpacity
            style={s.banner}
            onPress={() => navigation.navigate('Restaurantes')}
            activeOpacity={0.85}
          >
            <View style={s.bannerIconWrap}>
              <Feather name="send" size={20} color={ORANGE} />
            </View>
            <View style={s.bannerText}>
              <Text style={s.bannerTitle}>Kinal Gourmet House</Text>
              <Text style={s.bannerSub}>Explora restaurantes y haz tu pedido</Text>
            </View>
            <View style={s.bannerArrow}>
              <Feather name="arrow-right" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* ── Accesos rápidos ───────────────────────────────────── */}
          <Text style={s.sectionLabel}>Accesos rápidos</Text>
          <View style={s.grid}>
            {QUICK_ACTIONS.map((item, i) => {
              const isActive = i === 0;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[s.gridItem, isActive && s.gridItemActive]}
                  onPress={() => item.tab && navigation.navigate(item.tab)}
                  disabled={!item.tab}
                  activeOpacity={0.85}
                >
                  <View style={[s.gridIcon, isActive && s.gridIconActive]}>
                    <Feather name={item.icon} size={20} color={ORANGE} />
                  </View>
                  <Text style={[s.gridLabel, isActive && s.gridLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Cerrar sesión ─────────────────────────────────────── */}
          <TouchableOpacity
            style={s.logoutBtn}
            onPress={logout}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={14} color="#EF4444" />
            <Text style={s.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: CREAM },
  scroll: { paddingBottom: 80 },

  // Header
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  wordmark:    { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  wordmarkDot: { color: ORANGE },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  greeting:   { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 4 },
  name:       { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  nameAccent: { color: ORANGE },

  // Body
  body: { padding: 20 },

  // Banner
  banner: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDF0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText:  { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: DARK },
  bannerSub:   { fontSize: 11, color: MUTED, marginTop: 2 },
  bannerArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  gridItemActive: {
    backgroundColor: DARK,
    borderColor: DARK,
  },
  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDF0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconActive: {
    backgroundColor: 'rgba(232,101,10,0.18)',
  },
  gridLabel:       { fontSize: 12, fontWeight: '600', color: DARK, textAlign: 'center' },
  gridLabelActive: { color: '#fff' },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default HomeScreen;