// Página para crear una nueva rutina. Muestra el formulario y confirma éxito.
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useThemeToggle, getTheme } from '../hooks/useTheme';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Routine } from '../types/routine';
import { fetchExercises, Exercise } from '../services/api/apiNinja';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function CreateRoutinePage() {
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchExercises()
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleDay = (day: string) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleToggleExercise = (exName: string) => {
    setSelectedExercises(prev =>
      prev.includes(exName)
        ? prev.filter(e => e !== exName)
        : [...prev, exName]
    );
  };

  const handleCreate = async () => {
    if (name.trim() && days.length > 0) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user?.uid) return;
      const db = getFirestore();
      const routine: Routine = { name, description, exercises: selectedExercises, days, userId: user.uid };
      await addDoc(collection(db, 'routines'), routine);
      setSuccess(true);
      setTimeout(() => {
        router.push('/(tabs)/RoutinePage');
      }, 1200);
      setName('');
      setDescription('');
      setSelectedExercises([]);
      setDays([]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/RoutinePage')}>
        <FontAwesome name="arrow-left" size={22} color={colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.pageTitle, { color: colors.primary }]}>Crear nueva rutina</Text>
      {success ? (
        <Text style={[styles.successText, { color: colors.primary }]}>¡Rutina creada con éxito!</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Nombre de la rutina</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Piernas, Pecho, Cardio..."
            placeholderTextColor="#b3d1ff"
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Agrega una breve descripción"
            placeholderTextColor="#b3d1ff"
            multiline
          />
          <Text style={styles.label}>Días</Text>
          <View style={styles.daysRow}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={days.includes(day) ? styles.daySelected : styles.dayItem}
                onPress={() => handleToggleDay(day)}
              >
                <Text style={{ color: days.includes(day) ? '#fff' : '#357ae8', fontWeight: 'bold', fontSize: 18 }}>
                  {day.charAt(0)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Buscar ejercicio</Text>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Filtrar por nombre, músculo, tipo..."
            placeholderTextColor="#b3d1ff"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#357ae8" />
          ) : (
            <ScrollView style={{ maxHeight: 220 }}>
              {exercises
                .filter(ex =>
                  ex.name.toLowerCase().includes(search.toLowerCase()) ||
                  ex.muscle.toLowerCase().includes(search.toLowerCase()) ||
                  ex.type.toLowerCase().includes(search.toLowerCase())
                )
                .map(ex => (
                  <TouchableOpacity
                    key={ex.name}
                    style={selectedExercises.includes(ex.name) ? styles.exerciseSelected : styles.exerciseItem}
                    onPress={() => handleToggleExercise(ex.name)}
                  >
                    <View>
                      <Text style={{ fontWeight: 'bold', color: '#357ae8' }}>{ex.name}</Text>
                      <Text style={{ fontSize: 12, color: '#555' }}>{ex.type} | {ex.muscle} | {ex.equipment} | {ex.difficulty}</Text>
                      {selectedExercises.includes(ex.name) && <Text style={{ color: 'green', fontWeight: 'bold' }}>✓ Seleccionado</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}
          <TouchableOpacity
            style={[styles.button, (!name.trim() || days.length === 0) && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={!name.trim() || days.length === 0}
          >
            <Text style={styles.buttonText}>Crear rutina</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 63,
    paddingHorizontal: 0,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#357ae8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  successText: {
    fontSize: 18,
    color: '#357ae8',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: '#b3d1ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#357ae8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#b3d1ff',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#b3d1ff',
    backgroundColor: '#f7faff',
    borderRadius: 16,
    marginBottom: 4,
  },
  daySelected: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#357ae8',
    backgroundColor: '#357ae8',
    borderRadius: 16,
    marginBottom: 4,
  },
  exerciseItem: {
    backgroundColor: '#e1eaff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseSelected: {
    backgroundColor: '#d1ffd6',
  },
});
