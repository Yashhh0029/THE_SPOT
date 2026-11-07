/**
 * The Spot - Discover. Connect. Experience.
 * PARTIES · GAMING · COMMUNITIES · PEOPLE
 * Launch market: Pune, India
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AuthProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
