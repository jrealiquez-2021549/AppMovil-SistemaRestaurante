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

// ─── ForgotPasswordScreen ─────────────────────────────────────────────────────
const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { forgotPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [message, setMessage] = useState('');

  // ── Validación ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!email.trim()) {
      setEmailError('El correo es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Formato de correo inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  // ── Enviar ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setStatus('idle');
    setMessage('');

    const result = await forgotPassword(email.trim());

    if (result.success) {
      setMessage(result.message || 'Te enviamos un enlace para restablecer tu contraseña.');
      setStatus('success');
    } else {
      setMessage(result.error || 'Ocurrió un error, intenta nuevamente.');
      setStatus('error');
    }
  };

  // ── Estado de éxito ───────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <View style={[s.root, { justifyContent: 'center', paddingHorizontal: SPACING.lg }]}>
        <StatusBar barStyle="light-content" backgroundColor={GK.bg} />
        <View style={s.successBox}>
          <Text style={s.successEmoji}>📧</Text>
          <Text style={s.successTitle}>Correo enviado</Text>
          <Text style={s.successBody}>{message}</Text>
          <Button
            title="Volver al inicio de sesión"
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

      {/* Decoración */}
      <View style={s.blob1} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Botón volver ─────────────────────────────────────────────── */}
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Volver</Text>
          </TouchableOpacity>

          {/* ── Ícono principal ───────────────────────────────────────────── */}
          <View style={s.iconBox}>
            <Text style={s.iconEmoji}>🔐</Text>
          </View>

          {/* ── Título ───────────────────────────────────────────────────── */}
          <View style={s.titleBlock}>
            <Text style={s.title}>¿Olvidaste{'\n'}tu contraseña?</Text>
            <Text style={s.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecerla.
            </Text>
          </View>

          {/* ── Tarjeta formulario ────────────────────────────────────────── */}
          <View style={s.card}>
            <Input
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoComplete="email"
              dark
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) setEmailError('');
                if (status === 'error') setStatus('idle');
              }}
              error={emailError}
            />

            {status === 'error' && (
              <View style={s.errorBox}>
                <Text style={s.errorIcon}>⚠️</Text>
                <Text style={s.errorText}>{message}</Text>
              </View>
            )}

            <Button
              title={isLoading ? 'Enviando...' : 'Enviar enlace'}
              onPress={handleSubmit}
              isLoading={isLoading}
              style={s.btn}
              textStyle={s.btnText}
            />
          </View>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <View style={s.footer}>
            <Text style={s.footerText}>¿Recordaste tu contraseña?</Text>
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

  blob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(234,88,12,0.08)',
    top: -60,
    right: -80,
  },

  // Volver
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    paddingVertical: 4,
  },
  backText: {
    color: GK.orangeLight,
    fontSize: 14,
    fontWeight: '600',
  },

  // Ícono
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(234,88,12,0.35)',
    backgroundColor: GK.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  iconEmoji: { fontSize: 34 },

  // Título
  titleBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: GK.white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: GK.gray,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
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

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GK.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, fontSize: 13, color: GK.error, lineHeight: 18 },

  // Botón
  btn: {
    backgroundColor: GK.white,
    borderRadius: 20,
    shadowColor: GK.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: GK.bg,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  successTitle: { fontSize: 24, fontWeight: '800', color: GK.white, marginBottom: SPACING.sm },
  successBody: { fontSize: 14, color: GK.gray, textAlign: 'center', lineHeight: 22 },
});

export default ForgotPasswordScreen;
