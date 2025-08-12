// Página de detalle de rutina. Muestra información de la rutina seleccionada solo si pertenece al usuario.
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RoutineDetailPage() {
  const router = useRouter();
  // Obtiene el id de la rutina desde los parámetros de navegación
  const { id } = useLocalSearchParams();
  // Estado para la rutina actual
  const [routine, setRoutine] = React.useState<{ name?: string; description?: string; exercises?: string[]; days?: string[]; userId?: string } | null>(null);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  // Al montar, obtiene los datos de la rutina desde Firestore solo si pertenece al usuario
  React.useEffect(() => {
    const fetchRoutine = async () => {
      if (id && user?.uid) {
        const docRef = doc(db, 'routines', String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId === user.uid) {
            setRoutine(data);
          } else {
            setRoutine(null);
          }
        }
      }
    };
    fetchRoutine();
  }, [id]);

  // Si no tiene acceso, muestra mensaje
  if (!routine) {
    return (
      <View style={styles.container}><Text>No tienes acceso a esta rutina o no existe.</Text></View>
    );
  }

  // Renderiza la información de la rutina
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={22} color="#357ae8" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text style={styles.desc}>{routine.description}</Text>
        <Text style={styles.section}>Días de la semana</Text>
        <View style={styles.daysRow}>
          {routine.days?.map((day, idx) => (
            <Text key={idx} style={styles.dayChip}>{day}</Text>
          ))}
        </View>
        <Text style={styles.section}>Ejercicios</Text>
        <View style={styles.exerciseList}>
          {routine.exercises?.map((ex, idx) => (
            <Text key={idx} style={styles.exerciseItem}>{ex}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Quitar el título del header
export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 320,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  title: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  desc: {
    color: '#222',
    fontSize: 15,
    marginBottom: 12,
  },
  section: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  daysRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 12,
  },
  dayChip: {
    backgroundColor: '#b3d1ff',
    color: '#357ae8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    fontWeight: 'bold',
    fontSize: 13,
  },
  exerciseTitle: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  exerciseItem: {
    color: '#222',
    fontSize: 14,
    marginBottom: 4,
  },
  exerciseList: {
    marginTop: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'flex-start',
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
