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
import { width, heightGK, isSmall,isMedium, GK, fs, sp,s }  from '../../../shared/constants/forgotPassword';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { forgotPassword, isLoading } = useAuthStore();

  const [email, setEmail]         = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus]       = useState('idle'); // 'idle' | 'success' | 'error'
  const [message, setMessage]     = useState('');

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
      <View style={[s.root, { justifyContent: 'center', paddingHorizontal: width < 360 ? 14 : SPACING.lg }]}>
        <StatusBar barStyle="light-content" backgroundColor={GK.bg} />
        <View style={s.successBox}>
          <Text style={s.successEmoji}>📧</Text>
          <Text style={s.successTitle}>Correo enviado</Text>
          <Text style={s.successBody}>{message}</Text>
          <Button
            title="Volver al inicio de sesión"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: SPACING.lg, minHeight: 48 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={GK.bg} />

      <View style={s.blob1} pointerEvents="none" />

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
          {/* ── Botón volver ─────────────────────────────────────────────── */}
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={s.backText}>← Volver</Text>
          </TouchableOpacity>

          {/* ── Ícono ────────────────────────────────────────────────────── */}
          <View style={s.iconBox}>
            <Text style={s.iconEmoji}>🔐</Text>
          </View>

          {/* ── Título ───────────────────────────────────────────────────── */}
          <View style={s.titleBlock}>
            <Text style={s.title}>
              {isSmall ? '¿Olvidaste tu contraseña?' : '¿Olvidaste\ntu contraseña?'}
            </Text>
            <Text style={s.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
            </Text>
          </View>

          {/* ── Tarjeta formulario ────────────────────────────────────────── */}
          <View style={s.card}>
            <Input
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
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
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
            >
              <Text style={s.footerLink}> Iniciar sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;