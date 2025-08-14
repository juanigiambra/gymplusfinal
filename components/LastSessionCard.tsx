import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const LastSessionCard: React.FC = () => {
  const [lastSession, setLastSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLastSession = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user?.uid) {
        setLastSession(null);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const sessionData = querySnapshot.docs[0].data();
          setLastSession(sessionData);
        } else {
          setLastSession(null);
        }
      } catch (error) {
        setLastSession(null);
      }
      setLoading(false);
    };
    fetchLastSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.card}><ActivityIndicator color="#357ae8" /></View>
    );
  }

  return (
    <View style={styles.card}>
      {lastSession ? (
        <>
          <Text style={styles.title}>Última sesión</Text>
          <Text style={styles.name}>{lastSession.name || 'Sin nombre'}</Text>
          <Text style={styles.date}>{lastSession.date ? lastSession.date.split('T')[0] : ''}</Text>
          {lastSession.routineDays && Array.isArray(lastSession.routineDays) && (
            <Text style={styles.days}>Días: {lastSession.routineDays.join(', ')}</Text>
          )}
        </>
      ) : (
        <Text style={styles.noSession}>No hay sesiones registradas.</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (lastSession && lastSession.routineId) {
            router.push({ pathname: '/StartRoutinePage', params: { id: lastSession.routineId } });
          } else {
            router.push('/StartRoutinePage');
          }
        }}
      >
        <Text style={styles.buttonText}>Empezar nueva sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
    marginBottom: 12,
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  name: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  date: {
    color: '#357ae8',
    fontSize: 15,
    marginBottom: 4,
  },
  days: {
    color: '#357ae8',
    fontSize: 14,
    marginBottom: 6,
  },
  noSession: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#357ae8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default LastSessionCard;
