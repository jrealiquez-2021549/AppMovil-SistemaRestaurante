import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors, fonts, shadow, FEATURE_MAP, cardStyles as S } from '../constants/restaurants';

const CATEGORY_ICON = {
  GOURMET:     '✺',
  CASUAL:      '🍴',
  CAFETERIA:   '☕',
  FAST_FOOD:   '🍔',
  BAR:         '🍸',
  PIZZERIA:    '🍕',
  ITALIANA:    '🍝',
  MEXICANA:    '🌶',
  ASIATICA:    '🍣',
  MARISCOS:    '🦞',
  PARRILLADA:  '🥩',
  VEGETARIANA: '✿',
  POSTRES:     '🍰',
  OTRO:        '✺',
};

const CATEGORY_LABEL = {
  GOURMET:     'Gourmet',
  CASUAL:      'Casual',
  CAFETERIA:   'Cafetería',
  FAST_FOOD:   'Comida rápida',
  BAR:         'Bar',
  PIZZERIA:    'Pizzería',
  ITALIANA:    'Italiana',
  MEXICANA:    'Mexicana',
  ASIATICA:    'Asiática',
  MARISCOS:    'Mariscos',
  PARRILLADA:  'Parrillada',
  VEGETARIANA: 'Vegetariana',
  POSTRES:     'Postres',
  OTRO:        'Otro',
};

function mockAvailability(id) {
  if (!id) return 3;
  const seed = String(id)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (seed % 5) + 1;
}

function AvailDots({ count, total = 5 }) {
  return (
    <View style={S.dotRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[S.dot, { backgroundColor: i < count ? colors.dotLit : colors.dotOut }]}
        />
      ))}
    </View>
  );
}

export default function RestaurantCard({ restaurant, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const {
    _id,
    id,
    name,
    category,
    address,
    photo,
    averagePrice,   // campo real del backend
    isFeatured,
    features,
  } = restaurant || {};

  const restaurantId = _id || id;
  const availability = mockAvailability(restaurantId);
  const almostFull   = availability <= 2;
  const catKey       = category?.toUpperCase();
  const icon         = CATEGORY_ICON[catKey] ?? '✺';
  const catLabel     = CATEGORY_LABEL[catKey] ?? (category ?? 'Restaurante');

  // Precio formateado desde averagePrice del backend
  const priceText = averagePrice != null
    ? `Q${Number(averagePrice).toFixed(2)}`
    : '—';

  // Features reales del backend → etiquetas en español (máx 2)
  const featureTags = Object.entries(features ?? {})
    .filter(([, v]) => v === true)
    .slice(0, 2)
    .map(([k]) => {
      const entry = FEATURE_MAP[k];
      return entry ? `${entry.icon} ${entry.label}` : k;
    });

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 40, bounciness: 4 }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, shadow.card]}>
      <Pressable
        onPress={() => onPress?.(restaurant)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={S.card}
        accessibilityRole="button"
        accessibilityLabel={`Ver menú de ${name}`}
      >
        {/* ── Imagen izquierda ── */}
        <View style={S.imageWrap}>
          <Image
            source={typeof photo === 'string' ? { uri: photo } : photo}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          <View style={S.catBadge}>
            <Text style={S.catBadgeText}>{icon} {catLabel}</Text>
          </View>
        </View>

        {/* ── Contenido derecho ── */}
        <View style={S.body}>
          <View style={S.bodyTop}>
            {isFeatured && (
              <View style={S.newBadge}>
                <Text style={S.newBadgeText}>★ Destacado</Text>
              </View>
            )}
            <Text style={S.name} numberOfLines={1}>{name}</Text>
            {!!address && (
              <Text style={S.address} numberOfLines={1}>📍 {address}</Text>
            )}
          </View>

          <View style={S.bodyBottom}>
            {/* Precio real del backend */}
            <View>
              <Text style={S.priceLabel}>precio promedio</Text>
              <Text style={S.price}>{priceText}</Text>
            </View>

            {/* Features o disponibilidad */}
            <View style={S.rightInfo}>
              {featureTags.length > 0 ? (
                <View style={S.tagRow}>
                  {featureTags.map((t) => (
                    <View key={t} style={S.tag}>
                      <Text style={S.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={S.availWrap}>
                  <AvailDots count={availability} />
                  <Text style={S.availLabel}>
                    {almostFull ? 'casi lleno' : 'mesas hoy'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}