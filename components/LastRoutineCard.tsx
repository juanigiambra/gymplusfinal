import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LastRoutineCard: React.FC = () => {
  const [lastRoutine, setLastRoutine] = useState<any>(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.uid) return;
      // Consultar las sesiones ordenadas por fecha descendente y tomar la primera
      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      let sessions: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date) {
          sessions.push({ ...data, _id: doc.id });
        }
      });
      // Ordenar por fecha descendente
      sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLastRoutine(sessions[0] || null);
    };
    fetchSessions();
  }, [user]);

  if (!lastRoutine) return null;

  return (
    <>
      <Text style={styles.label}>Última Rutina:</Text>
      <View style={styles.card}>
        <Text style={styles.routineTitle}>{lastRoutine.routineName || 'Rutina desconocida'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          // Aquí podrías navegar a la pantalla de inicio de rutina
          // Por ejemplo: router.push(`/StartRoutinePage?routineId=${lastRoutine.routineId}`)
        }}>
          <Text style={styles.buttonText}>Empezar rutina</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#357ae8',
    marginTop: 18,
    marginBottom: 4,
    alignSelf: 'flex-start',
    marginLeft: '2.5%',
    letterSpacing: 0.2,
  },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    alignSelf: 'center',
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#b3d1ff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  routineTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#357ae8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default LastRoutineCard;
