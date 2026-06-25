import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HomeScreen     from '../../features/client/screens/HomeScreen';
import MyOrdersScreen from '../../features/client/screens/MyOrdersScreen';

const Tab = createBottomTabNavigator();

const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const MUTED  = '#8A8680';

const TabIcon = ({ name, focused }) => (
  <View style={[ti.wrapper, focused && ti.wrapperActive]}>
    <Feather name={name} size={16} color={focused ? '#fff' : MUTED} />
  </View>
);

const ti = StyleSheet.create({
  wrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperActive: {
    backgroundColor: ORANGE,
  },
});

const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3EF' }}>
    <Feather name="tool" size={40} color={MUTED} style={{ marginBottom: 12 }} />
    <Text style={{ fontSize: 16, fontWeight: '700', color: DARK }}>
      {route.name} — Próximamente
    </Text>
  </View>
);

const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: 'rgba(0,0,0,0.07)',
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 12,
        paddingTop: 8,
      },
      tabBarActiveTintColor:   ORANGE,
      tabBarInactiveTintColor: MUTED,
      tabBarLabelStyle: {
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 0.3,
        marginTop: 2,
      },
    }}
  >
    <Tab.Screen
      name="Inicio"
      component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
    />
    <Tab.Screen
      name="Mis Pedidos"
      component={MyOrdersScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="file-text" focused={focused} /> }}
    />
    <Tab.Screen
      name="Perfil"
      component={PlaceholderScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} /> }}
    />
  </Tab.Navigator>
);

export default ClientTabs;