import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  error,
  style,
  inputStyle,
  dark = false, // modo oscuro para pantallas de auth
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          dark && styles.inputWrapperDark,
          focused && (dark ? styles.inputFocusedDark : styles.inputFocused),
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, dark && styles.inputDark, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={dark ? 'rgba(255,255,255,0.35)' : COLORS.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.gray600,
    marginBottom: 8,
  },
  labelDark: {
    color: 'rgba(255,255,255,0.55)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.xxl,
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SPACING.md,
    height: 54,
  },
  inputWrapperDark: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  inputFocusedDark: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(234,88,12,0.1)',
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray900,
  },
  inputDark: {
    color: COLORS.white,
  },
  eyeButton: {
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default Input;
