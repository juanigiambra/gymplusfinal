// Página de detalle de rutina. Muestra información de la rutina seleccionada solo si pertenece al usuario.
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeToggle, getTheme } from '../hooks';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RoutineDetailPage() {
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);
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
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <View style={styles.card}>
          <Text style={[styles.noAccessTitle, { color: colors.error }]}>Rutina no disponible</Text>
          <Text style={[styles.noAccessDesc, { color: colors.primary }]}>No tienes acceso a esta rutina o no existe.</Text>
        </View>
      </View>
    );
  }

  // Renderiza la información de la rutina
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }] }>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.primary }]}>{routine.name}</Text>
        <Text style={[styles.desc, { color: colors.text }]}>{routine.description}</Text>
        <Text style={[styles.section, { color: colors.primary }]}>Días de la semana</Text>
        <View style={styles.daysRow}>
          {routine.days?.map((day, idx) => (
            <View key={idx} style={styles.dayChipBox}>
              <Text style={styles.dayChip}>{day}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.section}>Ejercicios</Text>
        <View style={styles.exerciseList}>
          {routine.exercises?.map((ex, idx) => (
            <View key={idx} style={styles.exerciseItemBox}>
              <Text style={styles.exerciseItem}>{ex}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.backTextButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
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
    paddingTop: 47, // 32 + 15
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    width: '92%',
    maxWidth: 400,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
    alignItems: 'center',
            marginTop: 15,
  },
  title: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    color: '#222',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center',
  },
  section: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#357ae8',
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayChipBox: {
    marginRight: 6,
    marginBottom: 6,
  },
  dayChip: {
    backgroundColor: '#b3d1ff',
    color: '#357ae8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 13,
    overflow: 'hidden',
    textAlign: 'center',
  },
  exerciseList: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'flex-start',
  },
  exerciseItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseDot: {
    color: '#357ae8',
    fontSize: 16,
    marginRight: 6,
    fontWeight: 'bold',
  },
  exerciseItem: {
    color: '#222',
    fontSize: 17,
    marginBottom: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  },
  backButton: {},
  backTextButton: {
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  backText: {
    color: '#357ae8',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    // Eliminar subrayado
  },
  noAccessTitle: {
    color: '#e83535',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  noAccessDesc: {
    color: '#357ae8',
    fontSize: 15,
    textAlign: 'center',
  },
});
