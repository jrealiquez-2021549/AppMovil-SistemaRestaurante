import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRestaurantStore } from '../../../shared/store/useRestaurantStore';
import RestaurantCard from '../../../shared/components/RestaurantCard';
import { FEATURE_CHIPS } from '../../../shared/constants/restaurants';

const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';

const TAB_ITEMS = [
  { icon: 'home',      label: 'Inicio',       tab: 'Inicio' },
  { icon: 'compass',   label: 'Restaurantes', tab: 'Restaurantes' },
  { icon: 'file-text', label: 'Pedidos',      tab: 'Mis Pedidos' },
  { icon: 'user',      label: 'Perfil',       tab: 'Perfil' },
];

export default function RestaurantsScreen({ navigation }) {
  const {
    restaurants, loading, error, requiresAuth,
    filterCategory, filterFeature,
    fetchRestaurants, getFiltered, getCategories,
    getCategoryLabel, setFilterCategory, setFilterFeature,
  } = useRestaurantStore();

  useEffect(() => { fetchRestaurants(); }, []);

  const filtered   = getFiltered();
  const categories = getCategories();

  const renderEmpty = () => {
    if (requiresAuth) return (
      <View style={s.center}>
        <Feather name="lock" size={40} color={MUTED} style={{ marginBottom: 12 }} />
        <Text style={s.emptyTitle}>Inicia sesión para explorar</Text>
        <Text style={s.emptySub}>Necesitás una cuenta para ver restaurantes</Text>
        <Pressable style={s.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={s.loginBtnText}>Iniciar sesión</Text>
        </Pressable>
      </View>
    );
    if (loading && restaurants.length === 0) return (
      <View style={s.center}>
        <ActivityIndicator color={ORANGE} size="large" />
      </View>
    );
    if (error) return (
      <View style={s.center}>
        <Feather name="alert-triangle" size={36} color={MUTED} style={{ marginBottom: 12 }} />
        <Text style={s.emptyTitle}>Algo salió mal</Text>
        <Text style={s.emptySub}>{error}</Text>
      </View>
    );
    return (
      <View style={s.center}>
        <Feather name="search" size={36} color={MUTED} style={{ marginBottom: 12 }} />
        <Text style={s.emptyTitle}>Sin resultados</Text>
        <Text style={s.emptySub}>Cambiá los filtros para ver más opciones</Text>
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Categorías */}
      <View style={s.chipsRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[s.chip, filterCategory === cat && s.chipActive]}
            onPress={() => setFilterCategory(cat)}
            activeOpacity={0.75}
          >
            <Text style={[s.chipText, filterCategory === cat && s.chipTextActive]}>
              {getCategoryLabel(cat)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Features */}
      <View style={[s.chipsRow, { marginTop: 8 }]}>
        {FEATURE_CHIPS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.chip, s.chipFeat, filterFeature === f.key && s.chipFeatActive]}
            onPress={() => setFilterFeature(filterFeature === f.key ? null : f.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.chipText, s.chipFeatText, filterFeature === f.key && s.chipFeatTextActive]}>
              {f.icon} {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length > 0 && (
        <Text style={s.resultCount}>
          {filtered.length} {filtered.length === 1 ? 'restaurante' : 'restaurantes'}
        </Text>
      )}
    </View>
  );

  const showEmpty =
    requiresAuth ||
    (loading && restaurants.length === 0) ||
    !!error ||
    filtered.length === 0;

  return (
    <View style={s.root}>
      {/* Header oscuro */}
      <View style={s.header}>
        <Text style={s.title}>
          ¿Cuál restaurante te{' '}
          <Text style={s.titleAccent}>interesa?</Text>
        </Text>
        <Text style={s.subtitle}>Excelencia gastronómica de Guatemala</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Feather name="search" size={15} color={MUTED} />
          <TextInput
            style={s.searchInput}
            placeholder="Busca un restaurante..."
            placeholderTextColor={MUTED}
          />
        </View>
      </View>

      {/* Chips + lista */}
      <View style={s.chipsSection}>
        <ListHeader />
      </View>

      {showEmpty ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item._id || item.id)}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchRestaurants}
              tintColor={ORANGE}
            />
          }
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {
                  id: item._id || item.id,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 4,
  },
  titleAccent: { color: ORANGE },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },

  // Search bar (blanco bajo el header oscuro)
  searchWrap: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // Sombra sutil para separar del header
    shadowColor: DARK,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    zIndex: 1,
  },
  searchBar: {
    backgroundColor: CREAM,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: DARK,
    padding: 0,
  },

  // Chips
  chipsSection: { paddingHorizontal: 16, paddingTop: 14 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: CREAM,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: DARK,
    borderColor: DARK,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chipTextActive: { color: '#fff' },
  chipFeat: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  chipFeatActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  chipFeatText: {
    color: DARK,
    textTransform: 'none',
    letterSpacing: 0,
  },
  chipFeatTextActive: { color: '#fff' },

  resultCount: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
  },

  // List
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 90 },

  // Empty state
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 6 },
  emptySub: { fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 20 },
  loginBtn: {
    marginTop: 20,
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

});