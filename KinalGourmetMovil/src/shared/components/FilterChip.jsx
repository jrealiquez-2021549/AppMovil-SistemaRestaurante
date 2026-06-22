import React from 'react';
import { Pressable, Text } from 'react-native';
import { chipStyles as S, shadow } from '../constants/restaurants';

export default function FilterChip({ label, icon, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        S.chip,
        active  && S.chipActive,
        pressed && S.chipPressed,
        !active && shadow.chip,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {!!icon && <Text style={S.icon}>{icon}</Text>}
      <Text style={[S.label, active && S.labelActive]}>{label}</Text>
    </Pressable>
  );
}