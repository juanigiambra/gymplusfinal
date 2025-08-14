// Pantalla de registro de usuario. Permite crear una cuenta y guardar datos extra en Firestore.
import React, { useState } from 'react';
import { useThemeToggle, getTheme } from '../hooks/useTheme';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import '../firebaseConfig';

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
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
    marginBottom: 12,
  },
  inputSmall: {
    flex: 1,
    marginRight: 6,
    marginLeft: 0,
    width: undefined,
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


export default function RegisterScreen() {
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);
  // Estados para los datos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Maneja el registro con Firebase Auth y guarda datos extra en Firestore
  const handleRegister = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Guardar datos extra en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombre,
        email,
        edad: Number(edad),
        altura: Number(altura),
        peso: Number(peso)
      });
      // Actualizar perfil en Firebase Auth
      await updateProfile(user, {
        displayName: nombre,
      });
      router.push('/(tabs)'); // Redirige a las tabs
    } catch (e) {
      setError('No se pudo registrar');
    }
  };

  // Renderiza la interfaz de registro
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.primary }]}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#7da6e3"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#7da6e3"
      />
      {/* Inputs para edad, altura y peso */}
      <View style={styles.rowInputs}>
        <TextInput
          style={[styles.input, styles.inputSmall]}
          placeholder="Edad"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          textAlign="center"
          placeholderTextColor="#7da6e3"
        />
        <TextInput
          style={[styles.input, styles.inputSmall]}
          placeholder="Altura"
          value={altura}
          onChangeText={setAltura}
          keyboardType="numeric"
          textAlign="center"
          placeholderTextColor="#7da6e3"
        />
        <TextInput
          style={[styles.input, styles.inputSmall]}
          placeholder="Peso"
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
          textAlign="center"
          placeholderTextColor="#7da6e3"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholderTextColor="#7da6e3"
      />
      <Text style={{ color: '#357ae8', fontSize: 13, marginBottom: 4 }}>
        La contraseña debe tener mínimo 6 caracteres.
      </Text>
      {/* Botón para registrar */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      {/* Muestra error si existe */}
      {error && <Text style={styles.error}>{error}</Text>}
      {/* Botón para volver al login */}
      <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Volver al login</Text>
      </TouchableOpacity>
    </View>
  );
}
