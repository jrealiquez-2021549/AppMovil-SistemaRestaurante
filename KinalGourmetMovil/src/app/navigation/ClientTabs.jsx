import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HomeScreen            from '../../features/client/screens/HomeScreen';
import MyOrdersScreen        from '../../features/client/screens/MyOrdersScreen';
import MyReservationsScreen  from '../../features/client/screens/MyReservationsScreen';
import ProfileScreen         from '../../features/client/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ORANGE = '#E8650A';
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
      name="Mis Reservaciones"
      component={MyReservationsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} /> }}
    />
    <Tab.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} /> }}
    />
  </Tab.Navigator>
);

export default ClientTabs;