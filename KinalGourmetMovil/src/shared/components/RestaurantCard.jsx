import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, spacing, shadow } from '../constants/restaurants';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const H_PADDING = spacing.lg;
const CARD_WIDTH = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;

const CATEGORY_ICON = {
  GOURMET: '✺',
  VEGETARIANA: '✿',
  MEXICANA: '🌶',
};

function mockAvailability(id) {
  if (!id) return 3;
  const seed = String(id)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (seed % 5) + 1; // 1..5
}

function CandleDots({ count, total = 5 }) {
  return (
    <View style={styles.candleRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.candleDot,
            { backgroundColor: i < count ? colors.candleLit : colors.candleOut },
          ]}
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
    price,
    isNew,
  } = restaurant || {};

  const restaurantId = _id || id;
  const availability = mockAvailability(restaurantId);
  const icon = CATEGORY_ICON[category?.toUpperCase()] ?? '✺';

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress?.(restaurant)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, shadow.card]}
        accessibilityRole="button"
        accessibilityLabel={`Ver menú de ${name}`}
      >
        <Image
          source={typeof photo === 'string' ? { uri: photo } : photo}
          style={styles.photo}
          resizeMode="cover"
        />

        {/* Degradado tipo luz de vela: cálido y ascendente, no negro plano */}
        <LinearGradient
          colors={[colors.overlayTop, colors.overlayMid, colors.overlayBottom]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* "Tag de reservación" colgante — esquina superior, ligeramente rotado,
            como una etiqueta física amarrada a la mesa */}
        <View style={styles.tagWrap}>
          <View style={styles.tagString} />
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>{icon}</Text>
            <Text style={styles.tagText} numberOfLines={1}>
              {category ?? 'Restaurante'}
            </Text>
          </View>
        </View>

        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>★ NUEVO</Text>
          </View>
        )}

        {/* Info sobre la franja inferior translúcida */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {!!address && (
            <Text style={styles.address} numberOfLines={1}>
              📍 {address}
            </Text>
          )}

          <View style={styles.footerRow}>
            <View>
              <Text style={styles.priceLabel}>desde</Text>
              <Text style={styles.price}>Q{price ?? '—'}</Text>
            </View>

            <View style={styles.availabilityWrap}>
              <CandleDots count={availability} />
              <Text style={styles.availabilityLabel}>
                {availability > 2 ? 'mesas hoy' : 'casi lleno'}
              </Text>
            </View>
          </View>

          <View style={styles.menuButton}>
            <Text style={styles.menuButtonText}>VER MENÚ</Text>
            <Text style={styles.menuButtonArrow}>→</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.inkCoffee,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },

  tagWrap: {
    position: 'absolute',
    top: 0,
    left: spacing.md,
    alignItems: 'center',
  },
  tagString: {
    width: 2,
    height: 8,
    backgroundColor: colors.borderOnDark,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cream,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    transform: [{ rotate: '-4deg' }],
    maxWidth: CARD_WIDTH - spacing.md * 2,
    ...shadow.chip,
  },
  tagIcon: {
    fontSize: 11,
  },
  tagText: {
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.leather,
    textTransform: 'uppercase',
  },

  newBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.gold,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  newBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.inkCoffee,
  },

  info: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.cream,
    marginBottom: 2,
  },
  address: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: 'rgba(250,246,240,0.7)',
    marginBottom: spacing.sm,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: 'rgba(250,246,240,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.gold,
  },

  availabilityWrap: {
    alignItems: 'flex-end',
  },
  candleRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 3,
  },
  candleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: 'rgba(250,246,240,0.6)',
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(250,246,240,0.12)',
    borderWidth: 1,
    borderColor: colors.borderOnDark,
    borderRadius: radii.pill,
    paddingVertical: 8,
  },
  menuButtonText: {
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.cream,
  },
  menuButtonArrow: {
    color: colors.gold,
    fontSize: 13,
  },
});