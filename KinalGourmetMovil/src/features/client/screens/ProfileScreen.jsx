import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../shared/store/authStore';

const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const MUTED  = '#8A8680';
const BG     = '#F5F3EF';
const WHITE  = '#FFFFFF';
const BORDER = 'rgba(0,0,0,0.08)';

/* ─── Avatar iniciales ─────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <View style={s.avatar}>
      <Text style={s.avatarText}>{initials}</Text>
    </View>
  );
};

/* ─── Fila de opción ───────────────────────────────── */
const OptionRow = ({ icon, label, onPress, danger = false, showArrow = true }) => (
  <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
    <View style={[s.rowIcon, danger && s.rowIconDanger]}>
      <Feather name={icon} size={16} color={danger ? '#E8650A' : DARK} />
    </View>
    <Text style={[s.rowLabel, danger && s.rowLabelDanger]}>{label}</Text>
    {showArrow && <Feather name="chevron-right" size={16} color={MUTED} />}
  </TouchableOpacity>
);

/* ─── Separador de sección ─────────────────────────── */
const SectionTitle = ({ title }) => (
  <Text style={s.sectionTitle}>{title}</Text>
);

/* ═══════════════════════════════════════════════════ */
const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleComingSoon = (feature) => {
    Alert.alert('Próximamente', `${feature} estará disponible pronto.`);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Mi perfil</Text>
        </View>

        {/* Tarjeta de usuario */}
        <View style={s.card}>
          <Avatar name={user?.name || user?.nombre} />
          <View style={s.cardInfo}>
            <Text style={s.userName} numberOfLines={1}>
              {user?.name || user?.nombre || 'Usuario'}
            </Text>
            <Text style={s.userEmail} numberOfLines={1}>
              {user?.email || '—'}
            </Text>
          </View>
          <TouchableOpacity
            style={s.editBtn}
            onPress={() => handleComingSoon('Editar perfil')}
            activeOpacity={0.8}
          >
            <Feather name="edit-2" size={14} color={ORANGE} />
          </TouchableOpacity>
        </View>

        {/* Sección Cuenta */}
        <SectionTitle title="Cuenta" />
        <View style={s.group}>
          <OptionRow
            icon="user"
            label="Información personal"
            onPress={() => handleComingSoon('Información personal')}
          />
          <View style={s.divider} />
          <OptionRow
            icon="map-pin"
            label="Mis direcciones"
            onPress={() => handleComingSoon('Mis direcciones')}
          />
          <View style={s.divider} />
          <OptionRow
            icon="lock"
            label="Cambiar contraseña"
            onPress={() => handleComingSoon('Cambiar contraseña')}
          />
        </View>

        {/* Sección Preferencias */}
        <SectionTitle title="Preferencias" />
        <View style={s.group}>
          <OptionRow
            icon="bell"
            label="Notificaciones"
            onPress={() => handleComingSoon('Notificaciones')}
          />
          <View style={s.divider} />
          <OptionRow
            icon="globe"
            label="Idioma"
            onPress={() => handleComingSoon('Idioma')}
          />
        </View>

        {/* Sección Soporte */}
        <SectionTitle title="Soporte" />
        <View style={s.group}>
          <OptionRow
            icon="help-circle"
            label="Centro de ayuda"
            onPress={() => handleComingSoon('Centro de ayuda')}
          />
          <View style={s.divider} />
          <OptionRow
            icon="file-text"
            label="Términos y condiciones"
            onPress={() => handleComingSoon('Términos y condiciones')}
          />
        </View>

        {/* Cerrar sesión */}
        <View style={[s.group, s.groupLast]}>
          <OptionRow
            icon="log-out"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
            showArrow={false}
          />
        </View>

        {/* Versión */}
        <Text style={s.version}>KinalGourmet v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK,
    letterSpacing: -0.5,
  },

  /* Tarjeta usuario */
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 0.5,
  },
  cardInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: MUTED,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Sección */
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },

  /* Grupo de opciones */
  group: {
    marginHorizontal: 16,
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  groupLast: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 52,
  },

  /* Fila */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowIconDanger: {
    backgroundColor: '#FFF0E8',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: DARK,
  },
  rowLabelDanger: {
    color: ORANGE,
  },

  /* Versión */
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: MUTED,
    marginTop: 24,
  },
});

export default ProfileScreen;
