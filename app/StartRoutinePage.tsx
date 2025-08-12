// Página para registrar una sesión de rutina. Permite ingresar series, repeticiones y peso por ejercicio.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../services/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Import used for back button icon

export default function StartRoutinePage() {
  // Obtiene el id de la rutina desde los parámetros de navegación
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // Estado para la rutina actual
  const [routine, setRoutine] = useState<any>(null);
  // Estado para los datos de la sesión (series por ejercicio)
  const [sessionData, setSessionData] = useState<{ [exercise: string]: Array<{ reps: string; weight: string }> }>({});
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para el nombre de la sesión
  const [sessionName, setSessionName] = useState('');

  // Al montar, obtiene los datos de la rutina desde Firestore
  useEffect(() => {
    const fetchRoutine = async () => {
      if (id) {
        const docRef = doc(db, 'routines', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoutine(docSnap.data());
        }
        setLoading(false);
      }
    };
    fetchRoutine();
  }, [id]);

  // Maneja el cambio de input en cada serie de cada ejercicio
  const handleInput = (exercise: string, idx: number, field: 'reps' | 'weight', value: string) => {
    setSessionData(prev => {
      const series = prev[exercise] || [{ reps: '', weight: '' }];
      const updated = [...series];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, [exercise]: updated };
    });
  };

  // Agrega una nueva serie al ejercicio
  const handleAddSerie = (exercise: string) => {
    setSessionData(prev => ({
      ...prev,
      [exercise]: [...(prev[exercise] || [{ reps: '', weight: '' }]), { reps: '', weight: '' }],
    }));
  };

  // Guarda la sesión en Firestore
  const handleSaveSession = async () => {
    if (!routine) return;
    await addDoc(collection(db, 'sessions'), {
      routineId: id,
      date: new Date().toISOString(), // La fecha se guarda bajo el nombre 'date'
      name: sessionName,
      exercises: sessionData,
    });
    Alert.alert('Sesión registrada', '¡Tu sesión fue guardada exitosamente!');
    router.push('/(tabs)/RoutinePage');
  };

  if (loading) {
    return <View style={styles.container}><Text>Cargando rutina...</Text></View>;
  }

  // Renderiza la interfaz para registrar la sesión
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={22} color="#357ae8" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Registrar sesión de rutina</Text>
        <Text style={styles.routineName}>{routine?.name}</Text>
        <Text style={styles.routineDesc}>{routine?.description}</Text>
        {/* Campo para editar el nombre de la sesión */}
        <Text style={styles.label}>Nombre de la sesión:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Sesión fuerza lunes"
          value={sessionName}
          onChangeText={setSessionName}
        />
        <Text style={styles.label}>Ejercicios:</Text>
        {routine?.exercises?.map((exercise: string, idx: number) => (
          <View key={idx} style={styles.exerciseRow}>
            <Text style={styles.exerciseName} numberOfLines={1} ellipsizeMode="tail">{exercise}</Text>
            {(sessionData[exercise] || [{ reps: '', weight: '' }]).map((serie, serieIdx) => (
              <View key={serieIdx} style={styles.inputsRow}>
                <Text style={styles.serieLabel}>Serie: {serieIdx + 1}</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder={`Reps`}
                  keyboardType="numeric"
                  value={serie.reps}
                  onChangeText={val => handleInput(exercise, serieIdx, 'reps', val)}
                  placeholderTextColor="#7da6e3"
                />
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder={`Peso`}
                  keyboardType="numeric"
                  value={serie.weight}
                  onChangeText={val => handleInput(exercise, serieIdx, 'weight', val)}
                  placeholderTextColor="#7da6e3"
                />
              </View>
            ))}
            {/* Botón para agregar una nueva serie */}
            <TouchableOpacity style={styles.addSerieButton} onPress={() => handleAddSerie(exercise)}>
              <Text style={styles.addSerieButtonText}>+ Agregar serie</Text>
            </TouchableOpacity>
          </View>
        ))}
        {/* Botón para guardar la sesión */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSession}>
          <Text style={styles.saveButtonText}>Guardar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export const options = {
  headerShown: false,
};

// Estilos para la pantalla de registro de sesión
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    paddingTop: 39, // antes 24, ahora 24+15
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '95%',
    maxWidth: 500,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: 'center',
  },
  title: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  routineName: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
    textAlign: 'center',
  },
  routineDesc: {
    color: '#222',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 8,
    fontSize: 16,
  },
  exerciseRow: {
    backgroundColor: '#f7faff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#b3d1ff',
    alignItems: 'center',
  },
  exerciseName: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b3d1ff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 15,
    color: '#357ae8',
  },
  inputSmall: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 60,
    maxWidth: 80,
  },
  saveButton: {
    backgroundColor: '#357ae8',
    paddingVertical: 12,
    borderRadius: 8,
    width: 180,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addSerieButton: {
    backgroundColor: '#b3d1ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 4,
  },
  addSerieButtonText: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  serieLabel: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 8,
  },
});
