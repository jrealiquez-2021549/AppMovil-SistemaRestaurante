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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import { SPACING, BORDER_RADIUS } from '../../../shared/constants/theme';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

// ─── Tokens internos ──────────────────────────────────────────────────────────
const GK = {
  bg:          '#1C0A00',
  bgMid:       '#2D1000',
  bgLight:     '#3D1800',
  orange:      '#EA580C',
  orangeLight: '#F97316',
  white:       '#FFFFFF',
  gray:        'rgba(255,255,255,0.5)',
  grayLight:   'rgba(255,255,255,0.15)',
  success:     '#86EFAC',
  successBg:   'rgba(22,163,74,0.15)',
  error:       '#FCA5A5',
  errorBg:     'rgba(220,38,38,0.15)',
};

// ─── RegisterScreen ───────────────────────────────────────────────────────────
const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, isLoading, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ── Validación local ──────────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.name.trim())
      e.name = 'El nombre es requerido';
    else if (form.name.trim().length < 3)
      e.name = 'Mínimo 3 caracteres';

    if (!form.email.trim())
      e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Formato de correo inválido';

    if (!form.password)
      e.password = 'La contraseña es requerida';
    else if (form.password.length < 6)
      e.password = 'Mínimo 6 caracteres';

    if (!form.confirmPassword)
      e.confirmPassword = 'Confirma tu contraseña';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Enviar registro ───────────────────────────────────────────────────────
  const handleRegister = async () => {
    setRegisterError(null);
    clearError();
    if (!validate()) return;

    const result = await register({
      name:     form.name.trim(),
      email:    form.email.trim(),
      password: form.password,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setRegisterError(result.error);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChangeText: (v) => {
      setForm({ ...form, [key]: v });
      if (errors[key]) setErrors({ ...errors, [key]: null });
    },
  });

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={[s.root, { justifyContent: 'center', paddingHorizontal: SPACING.lg }]}>
        <StatusBar barStyle="light-content" backgroundColor={GK.bg} />
        <View style={s.successBox}>
          <Text style={s.successEmoji}>✅</Text>
          <Text style={s.successTitle}>¡Cuenta creada!</Text>
          <Text style={s.successBody}>
            Revisa tu correo electrónico para activar tu cuenta antes de iniciar sesión.
          </Text>
          <Button
            title="Ir a iniciar sesión"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={GK.bg} />

      {/* Decoraciones */}
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
          {/* ── Encabezado ─────────────────────────────────────────────────── */}
          <View style={s.header}>
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={s.backText}>← Volver</Text>
            </TouchableOpacity>

            <View style={s.logoRing}>
              <Text style={s.logoEmoji}>🍽</Text>
            </View>
            <Text style={s.brandName}>KINAL GOURMET</Text>
            <Text style={s.brandTagline}>Únete a la excelencia gastronómica.</Text>
          </View>

          {/* ── Tarjeta del formulario ────────────────────────────────────── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Crear cuenta</Text>
            <Text style={s.cardSub}>Completa tus datos para empezar</Text>
            <View style={s.divider} />

            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              autoCapitalize="words"
              autoComplete="name"
              dark
              error={errors.name}
              {...field('name')}
            />

            <Input
              label="Correo electrónico"
              placeholder="ejemplo@kinal.edu.gt"
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
              autoComplete="new-password"
              dark
              error={errors.password}
              {...field('password')}
            />

            <Input
              label="Confirmar contraseña"
              placeholder="••••••••"
              secureTextEntry
              dark
              error={errors.confirmPassword}
              {...field('confirmPassword')}
            />

            {/* Error del servidor */}
            {registerError && (
              <View style={s.errorBox}>
                <Text style={s.errorIcon}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.errorTitle}>Error en el registro</Text>
                  <Text style={s.errorBody}>{registerError}</Text>
                </View>
              </View>
            )}

            <Button
              title={isLoading ? 'Registrando...' : 'CREAR CUENTA'}
              onPress={handleRegister}
              isLoading={isLoading}
              style={s.btnPrimary}
              textStyle={s.btnPrimaryText}
            />

            {/* Nota de verificación */}
            <View style={s.verifyNote}>
              <Text style={s.verifyNoteText}>
                📧 Al registrarte recibirás un correo de verificación para activar tu cuenta.
              </Text>
            </View>
          </View>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <View style={s.footer}>
            <Text style={s.footerText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.footerLink}> Iniciar sesión</Text>
            </TouchableOpacity>
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
    paddingTop: 48,
    paddingBottom: SPACING.xl,
  },

  // Blobs decorativos
  blob1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(234,88,12,0.1)',
    top: -60,
    left: -60,
  },
  blob2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(234,88,12,0.06)',
    bottom: 60,
    right: -40,
  },

  // Botón volver
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 24,
    paddingVertical: 4,
  },
  backText: {
    color: GK.orangeLight,
    fontSize: 14,
    fontWeight: '600',
  },

  // Header / marca
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(234,88,12,0.4)',
    backgroundColor: GK.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 30 },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: GK.white,
    letterSpacing: 4,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 12,
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
    fontSize: 26,
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
  errorIcon:  { fontSize: 18, marginTop: 1 },
  errorTitle: { fontSize: 13, fontWeight: '700', color: GK.error, marginBottom: 2 },
  errorBody:  { fontSize: 12, color: GK.gray, lineHeight: 18 },

  // Botón principal
  btnPrimary: {
    backgroundColor: GK.white,
    borderRadius: 20,
    marginBottom: SPACING.md,
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

  // Nota verificación
  verifyNote: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: GK.grayLight,
  },
  verifyNoteText: {
    fontSize: 12,
    color: GK.gray,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  footerText: { fontSize: 14, color: GK.gray },
  footerLink: { fontSize: 14, color: GK.orangeLight, fontWeight: '700' },

  // Éxito
  successBox: {
    backgroundColor: GK.bgMid,
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: GK.grayLight,
    alignItems: 'center',
  },
  successEmoji: { fontSize: 52, marginBottom: SPACING.md },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: GK.white,
    marginBottom: SPACING.sm,
  },
  successBody: {
    fontSize: 14,
    color: GK.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default RegisterScreen;
