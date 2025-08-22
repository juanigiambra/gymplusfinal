// Pantalla de inicio de sesión. Permite al usuario ingresar con email y contraseña.
import React, { useState } from 'react';
import { useThemeToggle } from '../../hooks';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 24,
  },
  input: {
    width: 220,
    padding: 10,
    borderWidth: 1,
    borderColor: '#b3d1ff',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#357ae8',
  },
  button: {
    backgroundColor: '#357ae8',
    paddingVertical: 12,
    borderRadius: 8,
    width: 220,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#e83535',
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 18,
  },
  linkText: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});


export default function LoginScreen() {
  const { theme, colors } = useThemeToggle();
  // Estados para email, contraseña y error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Maneja el login con Firebase Auth
  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/(tabs)'); // Redirige a las tabs
    } catch (e) {
      setError('Email o contraseña incorrectos');
    }
  };

  // Renderiza la interfaz de login
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.primary }]}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#7da6e3"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholderTextColor="#7da6e3"
      />
      {/* Botón para ingresar */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      {/* Botón para ir a registro */}
      <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.linkText}>Registrarse</Text>
      </TouchableOpacity>
      {/* Muestra error si existe */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
