// Layout principal de la app. Maneja la carga de fuentes, splash y navegación según autenticación.
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SessionProvider } from '../ctx';
import { ThemeProvider } from '../hooks';
// import { useEffect } from 'react';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Asegura que al recargar en /modal se mantenga el botón de volver.
  initialRouteName: '(tabs)',
};

// Evita que el splash se oculte antes de cargar fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Estado para saber si las fuentes están cargadas
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Si hay error de fuentes, lo lanza
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Cuando las fuentes están listas, oculta el splash
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Si no están cargadas, no renderiza nada
  if (!loaded) {
    return null;
  }

  // Renderiza la navegación principal envuelto en GestureHandlerRootView
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SessionProvider>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="CreateRoutinePage" options={{ headerShown: false }} />
            <Stack.Screen name="RoutineDetailPage" options={{ headerShown: false }} />
            <Stack.Screen name="StadisticsPage" options={{ headerShown: false }} />
            <Stack.Screen name="StartRoutinePage" options={{ headerShown: false }} />
            <Stack.Screen name="EditUserDataPage" options={{ headerShown: false }} />
          </Stack>
        </SessionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
