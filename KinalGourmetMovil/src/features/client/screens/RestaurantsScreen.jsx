import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useRestaurantStore } from '../../../shared/store/useRestaurantStore';
import RestaurantCard from '../../../shared/components/RestaurantCard';
import FilterChip from '../../../shared/components/FilterChip';
import {
  colors,
  styles,
  authStyles,
  FEATURE_CHIPS,
} from '../../../shared/constants/restaurants';

export default function RestaurantsScreen({ navigation }) {
  const {
    restaurants,
    loading,
    error,
    requiresAuth,
    filterCategory,
    filterFeature,
    fetchRestaurants,
    getFiltered,
    getCategories,
    getCategoryLabel,
    setFilterCategory,
    setFilterFeature,
  } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filtered   = getFiltered();
  const categories = getCategories();

  const handleOpenRestaurant = (restaurant) => {
    navigation.navigate('RestaurantDetail', {
      id: restaurant._id || restaurant.id,
    });
  };

  // ── Estado vacío / error / auth ───────────────────────────────────────────
  const renderEmpty = () => {
    if (requiresAuth) {
      return (
        <View style={styles.centerFill}>
          <Text style={styles.emptyIcon}>🔑</Text>
          <Text style={styles.emptyTitle}>Inicia sesión para explorar</Text>
          <Text style={styles.emptySubtitle}>
            Necesitás una cuenta para ver el catálogo de restaurantes
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={authStyles.loginButton}
          >
            <Text style={authStyles.loginButtonText}>INICIAR SESIÓN</Text>
          </Pressable>
        </View>
      );
    }
    if (loading && restaurants.length === 0) {
      return (
        <View style={styles.centerFill}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerFill}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerFill}>
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyTitle}>Sin resultados</Text>
        <Text style={styles.emptySubtitle}>
          Cambiá los filtros para ver más opciones
        </Text>
      </View>
    );
  };

  // ── Chips de filtro (cabecera del FlatList) ───────────────────────────────
  const ListHeader = () => (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
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
        style={styles.chipScroll}
      >
        {FEATURE_CHIPS.map((f) => (
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

      {filtered.length > 0 && (
        <Text style={styles.resultCount}>
          {filtered.length}{' '}
          {filtered.length === 1 ? 'restaurante' : 'restaurantes'}
        </Text>
      )}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  const showEmpty =
    requiresAuth ||
    (loading && restaurants.length === 0) ||
    !!error ||
    filtered.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>⚏ Explorar</Text>
        <Text style={styles.title}>¿Dónde cenamos hoy?</Text>
      </View>

      {showEmpty ? (
        <>
          <ListHeader />
          {renderEmpty()}
        </>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item._id || item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<ListHeader />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchRestaurants}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={handleOpenRestaurant}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}