import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',   // 'primary' | 'outline' | 'ghost' | 'danger'
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || isLoading;

  const containerStyle = [
    styles.base,
    variant === 'primary'  && styles.primary,
    variant === 'outline'  && styles.outline,
    variant === 'ghost'    && styles.ghost,
    variant === 'danger'   && styles.danger,
    isDisabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.text,
    variant === 'outline' && styles.textOutline,
    variant === 'ghost'   && styles.textGhost,
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: BORDER_RADIUS.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'rgba(234,88,12,0.08)',
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textGhost: {
    color: COLORS.primary,
  },
  textDisabled: {
    opacity: 0.8,
  },
});

export default Button;
