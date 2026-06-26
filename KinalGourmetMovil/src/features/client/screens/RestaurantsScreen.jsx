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
import { ORANGE, DARK, CREAM, MUTED, TAB_ITEMS, s } from '../../../shared/constants/restaurants';

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
