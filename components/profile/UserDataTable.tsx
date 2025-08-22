import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface UserData {
  displayName?: string;
  email?: string;
  edad?: number;
  peso?: number;
  altura?: number;
  objetivo?: string;
}

export default function UserDataTable() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setUserData(null);
          setLoading(false);
          return;
        }
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({
            displayName: user.displayName || userDoc.data().displayName,
            email: user.email || userDoc.data().email,
            edad: userDoc.data().edad,
            peso: userDoc.data().peso,
            altura: userDoc.data().altura,
            objetivo: userDoc.data().objetivo,
          });
        } else {
          setUserData({
            displayName: user.displayName ?? undefined,
            email: user.email ?? undefined,
          });
        }
      } catch (e) {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.userBox, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}> 
        <ActivityIndicator color="#357ae8" />
      </View>
    );
  }

  return (
    <View style={styles.userBox}>
      <Text style={styles.userLabel}>Nombre</Text>
      <Text style={styles.userValue}>{userData?.displayName || '-'}</Text>
      <Text style={styles.userLabel}>Email</Text>
      <Text style={styles.userValue}>{userData?.email || '-'}</Text>
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text style={styles.userLabel}>Edad</Text>
          <Text style={styles.userValue}>{userData?.edad ?? '-'}</Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: 6 }}>
          <Text style={styles.userLabel}>Peso (kg)</Text>
          <Text style={styles.userValue}>{userData?.peso ?? '-'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Text style={styles.userLabel}>Altura (cm)</Text>
          <Text style={styles.userValue}>{userData?.altura ?? '-'}</Text>
        </View>
      </View>
      <Text style={styles.userLabel}>Objetivo</Text>
      <Text style={styles.userValue}>{userData?.objetivo ?? '-'}</Text>
  <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('../EditUserDataPage')}>
          <Text style={styles.editButtonText}>Editar datos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '96%', // Ocupa casi el 100% del ancho
    maxWidth: 500,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    // marginBottom: 24, // Eliminado para quitar el margen inferior
    alignSelf: 'center',
  },
  userLabel: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  userValue: {
    color: '#222',
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#b3d1ff',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
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
});
