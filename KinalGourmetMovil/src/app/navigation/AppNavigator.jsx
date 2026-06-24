import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';

import AuthStack   from './AuthStack';
import ClientStack from './ClientStack';   // ← cambió

import { useAuthStore } from '../../shared/store/authStore';
import { COLORS } from '../../shared/constants/theme';

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated      = useAuthStore((state) => state._hasHydrated);
  const restoreSession  = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  if (!isHydrated) {
    return (
      <View style={s.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <ClientStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const s = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C0A00',
  },
});

export default AppNavigator;