import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRestaurantClientStore } from '../store/useRestaurantClientStore';
import RestaurantCard from '../components/RestaurantCard';
import FilterChip from '../components/FilterChip';
import { colors, fonts, spacing, styles } from '../../../shared/constants/restaurants';

// ── Features disponibles ─────────────────────────────────────────────────────
// TODO: ajustar estas keys cuando se confirme el nombre real de cada campo
// dentro de restaurant.features en el backend (placeholders por ahora).
const FEATURES = [
  { key: 'delivery',     label: 'Delivery', icon: '🛵' },
  { key: 'reservations', label: 'Reservas', icon: '📅' },
  { key: 'wifi',         label: 'Wifi',     icon: '📶' },
  { key: 'parking',      label: 'Parqueo',  icon: '🅿️' },
  { key: 'outdoor',      label: 'Exterior', icon: '🌿' },
];

export default function ExploreScreen({ navigation }) {
  const {
    restaurants,
    loading,
    error,
    filterCategory,
    filterFeature,
    fetchRestaurants,
    getFiltered,
    getCategories,
    getCategoryLabel,
    setFilterCategory,
    setFilterFeature,
  } = useRestaurantClientStore();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filtered = getFiltered();
  const categories = getCategories();

  const handleOpenRestaurant = (restaurant) => {
    navigation.navigate('RestaurantDetail', {
      id: restaurant._id || restaurant.id,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>⚏ EXPLORAR</Text>
        <Text style={styles.title}>¿Dónde cenamos hoy?</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            label={getCategoryLabel(cat)}
            active={filterCategory === cat}
            onPress={() => setFilterCategory(cat)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {FEATURES.map((f) => (
          <FilterChip
            key={f.key}
            label={f.label}
            icon={f.icon}
            active={filterFeature === f.key}
            onPress={() =>
              setFilterFeature(filterFeature === f.key ? null : f.key)
            }
          />
        ))}
      </ScrollView>

      {loading && restaurants.length === 0 ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.terracotta} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerFill}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>Sin mesas que mostrar</Text>
          <Text style={styles.emptySubtitle}>
            Cambia los filtros para ver más opciones
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id || item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchRestaurants}
              tintColor={colors.terracotta}
            />
          }
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} onPress={handleOpenRestaurant} />
          )}
        />
      )}
    </SafeAreaView>
  );
}