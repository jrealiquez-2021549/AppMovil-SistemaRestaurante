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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import { SPACING, BORDER_RADIUS } from '../../../shared/constants/theme';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { GK, fs, sp, s } from '../../../shared/constants/login';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, isLoading, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [errors, setErrors]           = useState({});
  const [registerError, setRegisterError] = useState(null);
  const [success, setSuccess]         = useState(false);

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

  // ── Pantalla de éxito ─────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={[s.root, { justifyContent: 'center', paddingHorizontal: width < 360 ? 14 : SPACING.lg }]}>
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
          {/* ── Encabezado ─────────────────────────────────────────────────── */}
          <View style={s.header}>
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.backText}>← Volver</Text>
            </TouchableOpacity>

            <View style={s.logoRing}>
              <Text style={s.logoEmoji}>🍽</Text>
            </View>
            <Text style={s.brandName}>KINAL GOURMET</Text>
            <Text style={s.brandTagline}>Únete a la excelencia gastronómica.</Text>
          </View>

          {/* ── Tarjeta ───────────────────────────────────────────────────── */}
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

            <View style={s.verifyNote}>
              <Text style={s.verifyNoteText}>
                📧 Al registrarte recibirás un correo de verificación para activar tu cuenta.
              </Text>
            </View>
          </View>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <View style={s.footer}>
            <Text style={s.footerText}>¿Ya tienes cuenta?</Text>
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

export default RegisterScreen;