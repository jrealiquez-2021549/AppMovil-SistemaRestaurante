import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientTabs from './ClientTabs';
import RestaurantDetailScreen from '../../features/client/screens/RestaurantDetailScreen';
import OrderDetailScreen from '../../features/client/screens/OrderDetailScreen';

const Stack = createNativeStackNavigator();

const ClientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientTabs" component={ClientTabs} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
  </Stack.Navigator>
);

export default ClientStack;