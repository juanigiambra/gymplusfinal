// Botón reutilizable para navegar a la página de creación de rutina.
import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateRoutineButton() {
  const router = useRouter();
  // Al presionar, navega a la página de creación de rutina
  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/CreateRoutinePage' })}>
      <Text style={styles.text}>Crear rutina</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 18,
    elevation: 2,
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
