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
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import { SPACING, BORDER_RADIUS, COLORS } from '../../../shared/constants/theme';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const { width } = Dimensions.get('window');

// ─── Tokens de color internos (oscuros, gastronómicos) ────────────────────────
const GK = {
  bg:          '#1C0A00',
  bgMid:       '#2D1000',
  bgLight:     '#3D1800',
  orange:      '#EA580C',
  orangeLight: '#F97316',
  white:       '#FFFFFF',
  gray:        'rgba(255,255,255,0.5)',
  grayLight:   'rgba(255,255,255,0.15)',
  inputBg:     'rgba(255,255,255,0.07)',
  inputBorder: 'rgba(255,255,255,0.15)',
  error:       '#FCA5A5',
  errorBg:     'rgba(220,38,38,0.15)',
};

// ─── LoginScreen ─────────────────────────────────────────────────────────────
const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading, clearError } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  // ── Validación local ──────────────────────────────────────────────────────
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

  // ── Enviar login ──────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError(null);
    clearError();
    if (!validate()) return;

    const result = await login(form.email.trim(), form.password);
    if (!result.success) {
      setLoginError(result.error);
    }
    // Si tiene éxito el AppNavigator detecta isAuthenticated y redirige sólo
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
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Encabezado / Marca ─────────────────────────────────────────── */}
          <View style={s.brand}>
            <View style={s.logoRing}>
              <Text style={s.logoEmoji}>🍽</Text>
            </View>
            <Text style={s.brandName}>KINAL GOURMET</Text>
            <Text style={s.brandTagline}>La excelencia gastronómica, en tu mano.</Text>
          </View>

          {/* ── Tarjeta del formulario ─────────────────────────────────────── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Bienvenido</Text>
            <Text style={s.cardSub}>Ingresa a tu cuenta</Text>
            <View style={s.divider} />

            <Input
              label="Correo electrónico"
              placeholder="chef@kinal.edu.gt"
              keyboardType="email-address"
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
            >
              <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Mensaje de error de red / servidor */}
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

          {/* ── Pie de confianza ───────────────────────────────────────────── */}
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

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GK.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 56,
    paddingBottom: SPACING.xl,
  },

  // Blobs decorativos
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(234,88,12,0.12)',
    top: -80,
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(234,88,12,0.07)',
    bottom: 100,
    left: -60,
  },

  // Marca
  brand: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(234,88,12,0.4)',
    backgroundColor: GK.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 34 },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: GK.white,
    letterSpacing: 4,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 13,
    color: GK.gray,
    fontStyle: 'italic',
  },

  // Tarjeta
  card: {
    backgroundColor: GK.bgMid,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: GK.grayLight,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: GK.white,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: GK.gray,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: GK.grayLight,
    marginBottom: SPACING.lg,
  },

  // Olvidé contraseña
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: SPACING.md,
  },
  forgotText: {
    fontSize: 13,
    color: GK.orangeLight,
    fontWeight: '600',
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: GK.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  errorIcon: { fontSize: 18, marginTop: 1 },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: GK.error,
    marginBottom: 2,
  },
  errorBody: {
    fontSize: 12,
    color: GK.gray,
    lineHeight: 18,
  },

  // Botón principal (sobreescribir defaults de Button con colores claros)
  btnPrimary: {
    backgroundColor: GK.white,
    borderRadius: BORDER_RADIUS.xxl,
    marginBottom: SPACING.sm,
    shadowColor: GK.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: {
    color: GK.bg,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // OR
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  orLine: { flex: 1, height: 1, backgroundColor: GK.grayLight },
  orText: { color: GK.gray, fontSize: 12, marginHorizontal: SPACING.sm },

  // Botón outline
  btnOutline: {
    borderColor: GK.grayLight,
    borderRadius: BORDER_RADIUS.xxl,
  },
  btnOutlineText: {
    color: GK.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Barra de confianza
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: GK.grayLight,
  },
  trustItem: { flex: 1, alignItems: 'center' },
  trustValue: { fontSize: 16, fontWeight: '800', color: GK.white, marginBottom: 2 },
  trustLabel: { fontSize: 10, color: GK.gray, textAlign: 'center', letterSpacing: 0.3 },
  trustSep:   { width: 1, height: 28, backgroundColor: GK.grayLight },
});

export default LoginScreen;
