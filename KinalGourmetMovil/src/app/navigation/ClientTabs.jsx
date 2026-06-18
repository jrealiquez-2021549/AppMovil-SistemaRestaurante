import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../shared/constants/theme';
import HomeScreen from '../../features/client/screens/HomeScreen';

const Tab = createBottomTabNavigator();

// Íconos en texto (sin dependencia externa de iconos)
const tabIcon = (emoji, focused) => (
  <View style={[ti.wrapper, focused && ti.wrapperActive]}>
    <Text style={ti.emoji}>{emoji}</Text>
  </View>
);

const ti = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
    borderRadius: 10,
  },
  wrapperActive: {
    backgroundColor: COLORS.primaryBg,
  },
  emoji: {
    fontSize: 22,
  },
});

// Pantallas placeholder para fases futuras
const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gray50 }}>
    <Text style={{ fontSize: 40, marginBottom: 12 }}>🚧</Text>
    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.gray700 }}>
      {route.name} — Próximamente
    </Text>
  </View>
);

const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.gray100,
        borderTopWidth: 1,
        height: 64,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarActiveTintColor:   COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray400,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
    <Tab.Screen
      name="Inicio"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('🏠', focused),
      }}
    />
    <Tab.Screen
      name="Restaurantes"
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('🍽', focused),
      }}
    />
    <Tab.Screen
      name="Mis Pedidos"
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('📋', focused),
      }}
    />
    <Tab.Screen
      name="Perfil"
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => tabIcon('👤', focused),
      }}
    />
  </Tab.Navigator>
);

export default ClientTabs;
