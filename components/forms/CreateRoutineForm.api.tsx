import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Routine } from '../../types/routine';
import { fetchExercises, Exercise } from '../../services/api/apiNinja';
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function CreateRoutineForm({ onCreate }: { onCreate?: (routine: Routine) => void }) {
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
      if (onCreate) onCreate(routine);
      setName('');
      setDescription('');
      setSelectedExercises([]);
      setDays([]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.label}>Nombre de la rutina</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Piernas, Pecho, Cardio..."
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
            <Text style={{ color: days.includes(day) ? '#fff' : '#333' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Buscar ejercicio</Text>
      <TextInput
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="Filtrar por nombre, músculo, tipo..."
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
                  <Text style={{ fontWeight: 'bold' }}>{ex.name}</Text>
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
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#f7faff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCard: {
    width: '92%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#357ae8',
      marginBottom: 18,
      textAlign: 'center',
    },
    label: {
      fontWeight: 'bold',
      color: '#357ae8',
      marginBottom: 6,
      marginTop: 8,
    },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9'
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 10
  },
  exerciseItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 4
  },
  exerciseSelected: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#4a90e2',
    backgroundColor: '#d0f5d8',
    borderRadius: 8,
    marginBottom: 4
  },
    dayItem: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#b3d1ff',
      backgroundColor: '#f7faff',
      borderRadius: 16,
      marginBottom: 4,
      marginHorizontal: 2,
    },
    daySelected: {
      padding: 8,
      borderWidth: 1,
      borderColor: '#357ae8',
      backgroundColor: '#357ae8',
      borderRadius: 16,
      marginBottom: 4,
      marginHorizontal: 2,
    },
    button: {
      backgroundColor: '#357ae8',
      paddingVertical: 14,
      borderRadius: 16,
      marginTop: 18,
      alignItems: 'center',
      shadowColor: '#357ae8',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    buttonDisabled: {
      backgroundColor: '#b3d1ff',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});
