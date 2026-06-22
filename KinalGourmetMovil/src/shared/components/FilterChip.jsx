import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing, shadow } from '../constants/restaurants';

export default function FilterChip({ label, icon, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive, !active && shadow.chip]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {!!icon && (
        <Text style={[styles.icon, active && styles.iconActive]}>{icon}</Text>
      )}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.inkCoffee,
    borderColor: colors.inkCoffee,
  },
  icon: {
    fontSize: 12,
  },
  iconActive: {
    color: colors.cream,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.leather,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.cream,
  },
});