// Página principal de rutinas del usuario. Permite ver, crear y acceder a rutinas.
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar as RNStatusBar, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../../services/firebase';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export const options = {
  headerShown: false,
};

export default function RoutinePage() {
  // Estado para las rutinas del usuario
  const [routines, setRoutines] = useState<Array<{ id: string; name: string; description: string; exercises: string[]; days: string[]; userId: string }>>([]);
  // Usuario autenticado actual
  const user = auth.currentUser;

  // Al montar, obtiene las rutinas del usuario desde Firestore
  useEffect(() => {
    const fetchRoutines = async () => {
      if (!user?.uid) return;
      const q = query(collection(db, 'routines'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data: { id: string; name: string; description: string; exercises: string[]; days: string[]; userId: string }[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          id: doc.id,
          name: docData.name ?? '',
          description: docData.description ?? '',
          exercises: Array.isArray(docData.exercises) ? docData.exercises : [],
          days: Array.isArray(docData.days) ? docData.days : [],
          userId: docData.userId ?? '',
        });
      });
      setRoutines(data);
    };
    fetchRoutines();
  }, [user]);

  // Crea una nueva rutina y la agrega al estado
  const handleCreateRoutine = async (routine: { name: string; description: string; exercises?: string[]; days?: string[] }) => {
    if (!user?.uid) return;
    const docRef = await addDoc(collection(db, 'routines'), { ...routine, userId: user.uid });
    setRoutines([{ id: docRef.id, ...routine, userId: user.uid }, ...routines]);
  };

  // Elimina una rutina de Firestore y del estado
  const handleDeleteRoutine = async (routineId?: string) => {
    if (!routineId) return;
    Alert.alert(
      'Eliminar rutina',
      '¿Estás seguro que deseas eliminar esta rutina? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'routines', routineId));
            setRoutines(routines.filter(r => r.id !== routineId));
          },
        },
      ]
    );
  };

  const router = useRouter();

  // Renderiza la lista de rutinas y el botón para crear nuevas
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.pageTitle}>Rutinas</Text>
      {routines.length > 0 && (
        <View style={styles.routineList}>
          {/* FlatList para mostrar hasta 3 rutinas y permitir scroll si hay más */}
          <FlatList
            data={routines}
            keyExtractor={(routine) => routine.id}
            renderItem={({ item }: { item: { id: string; name: string; description: string; exercises: string[]; days: string[]; userId: string } }) => (
              <View style={styles.routineCard}>
                <View style={styles.cardContentRow}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => router.push({ pathname: '/RoutineDetailPage', params: { id: item.id } })}
                    >
                      <Text style={styles.routineTitle}>{item.name}</Text>
                      <Text style={styles.routineDesc}>{item.description}</Text>
                      {/* Muestra los días de la rutina */}
                      <View style={styles.daysRow}>
                        {item.days?.map((day: string, i: number) => (
                          <Text key={i} style={styles.dayChip}>{day.charAt(0).toUpperCase()}</Text>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonColumn}>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => router.push({ pathname: '/StartRoutinePage', params: { id: item.id } })}
                    >
                      <Text style={styles.startButtonText}>Empezar rutina</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteRoutine(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            style={{ maxHeight: 3 * 110, width: '95%', alignSelf: 'center' }} // Altura máxima para 3 cards aprox, ancho 95%
            showsVerticalScrollIndicator={true}
          />
        </View>
      )}
      {/* Botón fijo en la parte inferior */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/StadisticsPage')}>
          <Text style={styles.editButtonText}>Ver estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createRoutineButton} onPress={() => router.push('/CreateRoutinePage')}>
          <Text style={styles.createRoutineButtonText}>+ Crear rutina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos para la pantalla de rutinas
const styles = StyleSheet.create({
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight ? RNStatusBar.currentHeight + 10 : 34) : 54, // 10px debajo de la barra de estado, fallback si undefined
    paddingBottom: 24,
    minHeight: '100%',
  },
  routineList: {
    width: '100%',
    alignItems: 'center',
    // justifyContent eliminado para que siga el flujo natural
  },
  routineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    width: '95%',
    maxWidth: 400, // Limita el ancho máximo para mejor visualización
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: 'center',
  },
  routineTitle: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  routineDesc: {
    color: '#222',
    fontSize: 15,
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    marginTop: 6,
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
  startButton: {
    backgroundColor: '#357ae8',
    paddingVertical: 8,
    borderRadius: 8,
    width: 140,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: '#e83535',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 8,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  screenName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 10,
    textAlign: 'center',
  },
  createRoutineButton: {
    backgroundColor: '#357ae8',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 18,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  createRoutineButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'android' ? 18 : 32,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 10,
  },
  // Reemplazar estilos de botones secundarios
  editButton: {
    backgroundColor: '#357ae8',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#357ae8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
});
