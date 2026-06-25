import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../shared/store/authStore';
import { useRestaurantStore } from '../../../shared/store/useRestaurantStore';
import AppHeader from '../../../shared/components/AppHeader';

// ── Colores ────────────────────────────────────────────────────
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';
const BORDER = 'rgba(0,0,0,0.08)';

// ── Filtros de características ─────────────────────────────────
const FEATURE_FILTERS = [
  { key: 'hasDelivery',         label: '🛵 Delivery'  },
  { key: 'acceptsReservations', label: '📅 Reservas'  },
  { key: 'hasWifi',             label: '📶 WiFi'      },
  { key: 'hasParking',          label: '🅿️ Parqueo'  },
  { key: 'hasOutdoorSeating',   label: '🌿 Exterior' },
];

// ── Iconos de categoría ────────────────────────────────────────
const CATEGORY_ICON = {
  GOURMET:'✺', CASUAL:'🍴', CAFETERIA:'☕', FAST_FOOD:'🍔',
  BAR:'🍸', PIZZERIA:'🍕', ITALIANA:'🍝', MEXICANA:'🌶',
  ASIATICA:'🍣', MARISCOS:'🦞', PARRILLADA:'🥩', VEGETARIANA:'✿',
  POSTRES:'🍰', OTRO:'✺',
};

// ── Tarjeta de restaurante ─────────────────────────────────────
function RestaurantCard({ restaurant, onPress }) {
  const { name, category, address, photo, averagePrice, averageRating } = restaurant || {};
  const catKey   = category?.toUpperCase();
  const catIcon  = CATEGORY_ICON[catKey] ?? '🍽';
  const catLabel = category?.replace('_', ' ') ?? 'Restaurante';
  const isNew    = !averageRating || averageRating === 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
      ]}
    >
      <View style={s.cardImgWrap}>
        {photo
          ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          : <View style={s.cardImgFallback}><Text style={{ fontSize: 32 }}>🍽</Text></View>
        }
        <View style={s.catBadge}>
          <Text style={s.catBadgeText}>{catIcon} {catLabel}</Text>
        </View>
      </View>

      <View style={s.cardBody}>
        <View style={s.cardTop}>
          <Text style={s.cardName} numberOfLines={1}>{name}</Text>
          <View style={[s.ratingBadge, isNew && s.ratingBadgeNew]}>
            <Text style={s.ratingText}>{isNew ? 'NUEVO' : `★ ${averageRating?.toFixed(1)}`}</Text>
          </View>
        </View>
        {!!address && <Text style={s.cardAddress} numberOfLines={1}>📍 {address}</Text>}
        <View style={s.cardFooter}>
          <Text style={s.cardPrice}>Q{Number(averagePrice || 0).toFixed(2)}</Text>
          <Text style={s.cardCta}>Ver menú →</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ── Chip de filtro ─────────────────────────────────────────────
function FilterChip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.chip, active && s.chipActive, pressed && { opacity: 0.75 }]}
    >
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

// ── Pantalla principal ─────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const { user, getProfile } = useAuthStore();
  const {
    loading, searchTerm, filterCategory, filterFeature,
    fetchRestaurants, getFiltered, getCategories, getCategoryLabel,
    setSearchTerm, setFilterCategory, setFilterFeature, clearFilters,
  } = useRestaurantStore();

  useEffect(() => {
    if (!user) getProfile();
    fetchRestaurants();
  }, []);

  const filtered   = getFiltered();
  const categories = getCategories();
  const hasFilters = searchTerm || filterCategory !== 'Todas' || filterFeature;

  return (
    <View style={s.root}>

      {/* ── HEADER GLOBAL ────────────────────────────────────── */}
      {/*
        AppHeader vive fuera del ScrollView para quedarse fijo
        en la parte superior mientras el contenido scrollea.
        El hero oscuro empieza justo debajo.
      */}
      <AppHeader navigation={navigation} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HERO (eslogan + buscador) ─────────────────────── */}
        <View style={s.hero}>
          <Text style={s.heroQuestion}>¿Qué se te antoja</Text>
          <Text style={s.heroToday}>
            <Text style={s.heroTodayAccent}>hoy</Text>
            <Text style={s.heroTodayWhite}>?</Text>
          </Text>
          <Text style={s.heroTagline}>Explora la excelencia gastronómica de Guatemala.</Text>

          {/* Buscador */}
          <View style={s.searchWrap}>
            <Feather name="search" size={16} color={MUTED} style={{ marginRight: 8 }} />
            <TextInput
              style={s.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Busca un restaurante o especialidad..."
              placeholderTextColor={MUTED}
              returnKeyType="search"
            />
            {!!searchTerm && (
              <TouchableOpacity onPress={() => setSearchTerm('')} style={{ padding: 4 }}>
                <Feather name="x" size={14} color={MUTED} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <View style={s.body}>

          {/* Cabecera Explorar */}
          <View style={s.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="sliders" size={14} color={ORANGE} />
              <Text style={s.sectionTitle}>EXPLORAR</Text>
            </View>
            {!!hasFilters && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={s.resetText}>✕ REINICIAR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Chips categorías */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
          >
            {categories.map((cat) => (
              <FilterChip
                key={cat}
                label={getCategoryLabel(cat).toUpperCase()}
                active={filterCategory === cat}
                onPress={() => setFilterCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* Chips características */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
            style={{ marginTop: 8 }}
          >
            {FEATURE_FILTERS.map(({ key, label }) => (
              <FilterChip
                key={key}
                label={label.toUpperCase()}
                active={filterFeature === key}
                onPress={() => setFilterFeature(filterFeature === key ? null : key)}
              />
            ))}
          </ScrollView>

          {/* ── Resultados ─────────────────────────────────────── */}
          <View style={{ marginTop: 20 }}>
            {loading ? (
              <View style={s.centered}>
                <ActivityIndicator size="large" color={ORANGE} />
                <Text style={s.loadingText}>Cargando...</Text>
              </View>
            ) : filtered.length === 0 ? (
              <View style={s.empty}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🍽</Text>
                <Text style={s.emptyTitle}>Sin coincidencias</Text>
                <Text style={s.emptyMsg}>Prueba con otros filtros o busca algo diferente.</Text>
                {!!hasFilters && (
                  <TouchableOpacity onPress={clearFilters} style={s.emptyBtn}>
                    <Text style={s.emptyBtnText}>Limpiar filtros</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <Text style={s.resultsLabel}>
                  {filtered.length} restaurante{filtered.length !== 1 ? 's' : ''}
                </Text>
                {filtered.map((r) => (
                  <RestaurantCard
                    key={r._id || r.id}
                    restaurant={r}
                    onPress={() =>
                      navigation.navigate('RestaurantDetail', {
                        id: r._id || r.id,
                      })
                    }
                  />
                ))}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ── StyleSheet ─────────────────────────────────────────────────
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: DARK },   // DARK para que header + hero sean un bloque continuo
  scroll: { paddingBottom: 32 },

  /* Hero — continúa visualmente el fondo del AppHeader */
  hero: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 6,          // el header ya tiene su paddingBottom
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroQuestion:    { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 2 },
  heroToday:       { fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginBottom: 6 },
  heroTodayAccent: { color: ORANGE },
  heroTodayWhite:  { color: WHITE },
  heroTagline:     { fontSize: 12, color: 'rgba(255,255,255,0.40)', marginBottom: 18 },

  /* Buscador */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 13, color: DARK, paddingVertical: 0 },

  /* Body */
  body: {
    backgroundColor: CREAM,   // el scroll vuelve al crema desde aquí
    padding: 20,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: DARK, letterSpacing: 1.5 },
  resetText:    { fontSize: 10, fontWeight: '800', color: ORANGE, letterSpacing: 0.8 },

  /* Chips */
  chipsRow: { gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  chipActive:     { backgroundColor: DARK, borderColor: DARK },
  chipText:       { fontSize: 11, fontWeight: '800', color: MUTED, letterSpacing: 0.5 },
  chipTextActive: { color: WHITE },

  /* Results */
  resultsLabel: {
    fontSize: 11, fontWeight: '700', color: MUTED,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },

  /* Card */
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImgWrap:     { height: 160, backgroundColor: '#FFF0E8', overflow: 'hidden' },
  cardImgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  catBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  catBadgeText: { fontSize: 10, fontWeight: '800', color: DARK },
  cardBody:     { padding: 14 },
  cardTop:      {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 4,
  },
  cardName:       { flex: 1, fontSize: 15, fontWeight: '700', color: DARK, marginRight: 8 },
  ratingBadge:    { backgroundColor: '#FBBF24', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  ratingBadgeNew: { backgroundColor: '#FDF0E8' },
  ratingText:     { fontSize: 9, fontWeight: '900', color: DARK },
  cardAddress:    { fontSize: 11, color: MUTED, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cardPrice: { fontSize: 16, fontWeight: '900', color: DARK },
  cardCta:   { fontSize: 10, fontWeight: '800', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Loading / Empty */
  centered:    { paddingVertical: 48, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 11, fontWeight: '700', color: MUTED, letterSpacing: 1, textTransform: 'uppercase' },
  empty: {
    paddingVertical: 40, alignItems: 'center',
    backgroundColor: WHITE, borderRadius: 20,
    borderWidth: 1.5, borderColor: BORDER, borderStyle: 'dashed', marginTop: 8,
  },
  emptyTitle:   { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 4 },
  emptyMsg:     { fontSize: 12, color: MUTED, textAlign: 'center', paddingHorizontal: 24 },
  emptyBtn:     { marginTop: 16, backgroundColor: ORANGE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  emptyBtnText: { fontSize: 12, fontWeight: '700', color: WHITE },
});

export default HomeScreen;