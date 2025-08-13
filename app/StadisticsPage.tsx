// Página de estadísticas. Lista las sesiones y expande el gráfico de cada ejercicio al tocar una sesión.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ExerciseLineChart from '../components/charts/ExerciseLineChart';
import { Stack, useRouter } from 'expo-router';

// Ocultar el header en StadisticsPage
export const options = {
  headerShown: false,
};

export default function StadisticsPage() {
  const router = useRouter();
  // Estado para las rutinas del usuario
  const [routines, setRoutines] = useState<Array<{ id: string; name: string; description: string; exercises: string[] }>>([]);
  // Estado para la rutina seleccionada
  const [selectedRoutine, setSelectedRoutine] = useState<string>('');
  // Estado para las sesiones de la rutina seleccionada
    const [sessions, setSessions] = useState<Array<{ name?: string; date: string; exercises: Record<string, Array<{ weight: number }>> }>>([]);
  // Estado para la sesión expandida
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para el modal
  const [modalVisible, setModalVisible] = useState(false);

  // Al montar, obtiene las rutinas del usuario desde Firestore
  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user?.uid) {
        setRoutines([]);
        setLoading(false);
        return;
      }
      const q = query(collection(db, 'routines'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
        const data: { id: string; name: string; description: string; exercises: string[] }[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          name: docData.name ?? '',
          description: docData.description ?? '',
          exercises: Array.isArray(docData.exercises) ? docData.exercises : [],
        });
      });
      setRoutines(data);
      setLoading(false);
    };
    fetchRoutines();
  }, []);

  // Cuando cambia la rutina seleccionada, obtiene las sesiones de esa rutina
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedRoutine) {
        setSessions([]);
        return;
      }
      const q = query(collection(db, 'sessions'), where('routineId', '==', selectedRoutine));
      const querySnapshot = await getDocs(q);
        const data: { name?: string; date: string; exercises: Record<string, Array<{ weight: number }>> }[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          name: docData.name ?? '',
          date: docData.date ?? '',
          exercises: docData.exercises ?? {},
        });
      });
      // Ordena por fecha
      data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSessions(data);
    };
    fetchSessions();
  }, [selectedRoutine]);

  // Renderiza la interfaz de selección de rutina y lista las sesiones
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de entrenamiento</Text>
      <Text style={styles.label}>Selecciona una rutina:</Text>
      {loading ? (
        <Text>Cargando rutinas...</Text>
      ) : (
        <View style={{ width: '90%', marginBottom: 18 }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedRoutine ? routines.find(r => r.id === selectedRoutine)?.name : 'Selecciona una rutina...'}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <FlatList
                data={routines}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedRoutine(item.id);
                      setExpandedSession(null);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>
        </View>
      )}
      {/* Lista las sesiones y expande el gráfico al tocar */}
      {selectedRoutine && (
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Sesiones registradas</Text>
          {sessions.length === 0 ? (
            <Text>No hay sesiones para esta rutina.</Text>
          ) : (
            <View>
              {sessions.map((session, idx) => (
                <View key={idx} style={styles.sessionBox}>
                  <TouchableOpacity onPress={() => setExpandedSession(expandedSession === idx ? null : idx)}>
                    <Text style={styles.sessionName}>{session.name || 'Sin nombre'}</Text>
                    <Text style={styles.sessionDate}>{session.date.split('T')[0]}</Text>
                  </TouchableOpacity>
                  {/* Si la sesión está expandida, muestra los gráficos de cada ejercicio */}
                  {expandedSession === idx && routines.find(r => r.id === selectedRoutine)?.exercises.map((exercise, exIdx) => {
                    // Obtiene los datos de todas las sesiones para este ejercicio
                    const exerciseProgress = sessions
                      .map(s => {
                        const series = s.exercises[exercise];
                        if (series && series.length > 0) {
                          return { date: s.date.split('T')[0], weight: Number(series[series.length - 1].weight) };
                        }
                        return null;
                      })
                      .filter((d): d is { date: string; weight: number } => d !== null);
                    return (
                      <View key={exIdx} style={styles.exerciseChartBox}>
                        <Text style={styles.exerciseTitle}>{exercise}</Text>
                        {exerciseProgress.length > 0 ? (
                          <ExerciseLineChart
                            labels={exerciseProgress.map(d => d.date)}
                            data={exerciseProgress.map(d => d.weight)}
                          />
                        ) : (
                          <Text>No hay datos para este ejercicio.</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
  {/* Agregar texto de nombre de pantalla arriba */}
      {/* Botón de volver */}
      <TouchableOpacity style={styles.cancelTextButton} onPress={() => router.push('/(tabs)/RoutinePage')}>
        <Text style={styles.cancelText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Ocultar el header en StadisticsPage
StadisticsPage.options = {
  headerShown: false,
};

// Estilos para la pantalla de estadísticas
const styles = StyleSheet.create({
  sessionName: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    paddingTop: 54, // antes 39, ahora 39+15
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#357ae8',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#357ae8',
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  routineList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 18,
    width: '100%',
  },
  routineButton: {
    backgroundColor: '#b3d1ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
    margin: 6,
    elevation: 2,
    alignItems: 'center',
  },
  selectedRoutine: {
    backgroundColor: '#357ae8',
  },
  routineButtonText: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    width: '95%',
    maxWidth: 500,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 12,
    alignSelf: 'center',
  },
  statsTitle: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    textAlign: 'center',
  },
  sessionBox: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#b3d1ff',
    paddingBottom: 12,
    backgroundColor: '#f7faff',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    alignSelf: 'center',
  },
  sessionDate: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  exerciseChartBox: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#357ae8',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
  },
  exerciseTitle: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d1ff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    elevation: 1,
  },
  dropdownButtonText: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  modalContent: {
    position: 'absolute',
    top: '30%',
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },
  dropdownItemText: {
    color: '#357ae8',
    fontSize: 16,
    textAlign: 'center',
  },
  screenName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 10,
    textAlign: 'center',
  },
  cancelTextButton: {
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  cancelText: {
    color: '#357ae8',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    // Eliminar subrayado
  },
  sessionName: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
});
