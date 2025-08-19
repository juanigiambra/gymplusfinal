export const options = {
  headerShown: false,
};

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useThemeToggle, getTheme } from '../hooks/useTheme';

export default function EditUserDataPage() {
  const router = useRouter();
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);
  const [form, setForm] = useState({
    displayName: '',
    edad: '',
    peso: '',
    altura: '',
    objetivo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setForm({
            displayName: data.displayName || user.displayName || '',
            edad: data.edad ? String(data.edad) : '',
            peso: data.peso ? String(data.peso) : '',
            altura: data.altura ? String(data.altura) : '',
            objetivo: data.objetivo || '',
          });
        } else {
          setForm({
            displayName: user.displayName || '',
            edad: '',
            peso: '',
            altura: '',
            objetivo: '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: form.displayName,
        edad: form.edad ? Number(form.edad) : null,
        peso: form.peso ? Number(form.peso) : null,
        altura: form.altura ? Number(form.altura) : null,
        objetivo: form.objetivo,
      });
      router.replace('/(tabs)/Profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <SafeAreaView style={{ width: '100%' }}>
        <Text style={[styles.pageTitle, { color: colors.primary }]}>Edita tus datos</Text>
      </SafeAreaView>
  <Text style={[styles.label, { color: colors.primary }]}>Nombre</Text>
  <TextInput
    style={[styles.input, styles.fullWidthInput, { color: colors.text, borderColor: colors.secondary }]}
    value={form.displayName}
    onChangeText={v => setForm(f => ({ ...f, displayName: v }))}
    placeholder="Nombre"
    placeholderTextColor={colors.secondary}
  />
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text style={[styles.label, { color: colors.primary }]}>Edad</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
            value={form.edad}
            onChangeText={v => setForm(f => ({ ...f, edad: v }))}
            placeholder="Edad"
            placeholderTextColor={colors.secondary}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 6 }}>
          <Text style={[styles.label, { color: colors.primary }]}>Peso (kg)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
            value={form.peso}
            onChangeText={v => setForm(f => ({ ...f, peso: v }))}
            placeholder="Peso"
            placeholderTextColor={colors.secondary}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Text style={[styles.label, { color: colors.primary }]}>Altura (cm)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
            value={form.altura}
            onChangeText={v => setForm(f => ({ ...f, altura: v }))}
            placeholder="Altura"
            placeholderTextColor={colors.secondary}
            keyboardType="numeric"
          />
        </View>
      </View>
      <Text style={[styles.label, { color: colors.primary }]}>Objetivo</Text>
      <TextInput
        style={[styles.input, styles.fullWidthInput, { color: colors.text, borderColor: colors.secondary }]}
        value={form.objetivo}
        onChangeText={v => setForm(f => ({ ...f, objetivo: v }))}
        placeholder="Objetivo"
        placeholderTextColor={colors.secondary}
      />
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/Profile')}>
          <Text style={[styles.cancelText, { color: colors.primary }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  input: {
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 4,
    minWidth: 100,
  },
  fullWidthInput: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  bottomButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
