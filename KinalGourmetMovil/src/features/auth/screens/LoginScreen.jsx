import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import { SPACING, BORDER_RADIUS } from '../../../shared/constants/theme';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { width, heightGK, isSmall,isMedium, GK, fs, sp,s } from '../../../shared/constants/login';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading, clearError } = useAuthStore();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [loginError, setLoginError] = useState(null);

  // ── Validación ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email.trim())
      e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Formato de correo inválido';

    if (!form.password)
      e.password = 'La contraseña es requerida';
    else if (form.password.length < 6)
      e.password = 'Mínimo 6 caracteres';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError(null);
    clearError();
    if (!validate()) return;

    const result = await login(form.email.trim(), form.password);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChangeText: (v) => {
      setForm({ ...form, [key]: v });
      if (errors[key]) setErrors({ ...errors, [key]: null });
    },
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={GK.bg} />

      {/* Decoración de fondo */}
      <View style={s.blob1} pointerEvents="none" />
      <View style={s.blob2} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Marca ────────────────────────────────────────────────────── */}
          <View style={s.brand}>
            <View style={s.logoRing}>
              <Text style={s.logoEmoji}>🍽</Text>
            </View>
            <Text style={s.brandName}>KINAL GOURMET</Text>
            <Text style={s.brandTagline}>La excelencia gastronómica, en tu mano.</Text>
          </View>

          {/* ── Tarjeta ──────────────────────────────────────────────────── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Bienvenido</Text>
            <Text style={s.cardSub}>Ingresa a tu cuenta</Text>
            <View style={s.divider} />

            <Input
              label="Correo electrónico"
              placeholder="chef@kinal.edu.gt"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              dark
              error={errors.email}
              {...field('email')}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry
              dark
              error={errors.password}
              {...field('password')}
            />

            <TouchableOpacity
              style={s.forgotRow}
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Error de servidor */}
            {loginError && (
              <View style={s.errorBox}>
                <Text style={s.errorIcon}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.errorTitle}>No se pudo iniciar sesión</Text>
                  <Text style={s.errorBody}>{loginError}</Text>
                </View>
              </View>
            )}

            <Button
              title={isLoading ? 'Verificando...' : 'INGRESAR'}
              onPress={handleLogin}
              isLoading={isLoading}
              style={s.btnPrimary}
              textStyle={s.btnPrimaryText}
            />

            <View style={s.orRow}>
              <View style={s.orLine} />
              <Text style={s.orText}>o</Text>
              <View style={s.orLine} />
            </View>

            <Button
              title="Crear cuenta nueva"
              variant="outline"
              onPress={() => navigation.navigate('Register')}
              style={s.btnOutline}
              textStyle={s.btnOutlineText}
            />
          </View>

          {/* ── Trust bar ────────────────────────────────────────────────── */}
          <View style={s.trustBar}>
            <View style={s.trustItem}>
              <Text style={s.trustValue}>24/7</Text>
              <Text style={s.trustLabel}>Disponible</Text>
            </View>
            <View style={s.trustSep} />
            <View style={s.trustItem}>
              <Text style={s.trustValue}>+10K</Text>
              <Text style={s.trustLabel}>Clientes</Text>
            </View>
            <View style={s.trustSep} />
            <View style={s.trustItem}>
              <Text style={s.trustValue}>5★</Text>
              <Text style={s.trustLabel}>Calidad</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;