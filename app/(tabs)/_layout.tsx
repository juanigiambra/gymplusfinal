// Layout de las tabs principales de la app. Define las pestañas visibles y sus iconos.
import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { useThemeToggle, getTheme } from '../../hooks/useTheme';
import { Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useSession } from '../../ctx';
import { useRouter } from 'expo-router';

// Componente para mostrar el icono de cada tab
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { user, loading } = useSession();
  const router = useRouter();
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: theme === 'dark' ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: theme === 'dark' ? '#23272f' : '#e0e0e0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="RoutinePage"
        options={{
          tabBarLabel: 'Rutinas',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Ocultar encabezados en pantallas en pila y en rutas fuera de tabs
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export const screenOptions = {
  headerShown: false,
};
