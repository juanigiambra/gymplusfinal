import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface UserDataTableProps {
  user: { displayName?: string; email?: string };
  extraData: { edad?: number; objetivo?: string };
  editMode: boolean;
  form: { edad?: string; objetivo?: string };
  setForm: React.Dispatch<React.SetStateAction<{ edad?: string; objetivo?: string }>>;
  onEdit: () => void;
  onSave: () => void;
}

export default function UserDataTable({ user, extraData, editMode, form, setForm, onEdit, onSave }: UserDataTableProps) {
  return (
    <View style={styles.userBox}>
      <Text style={styles.userLabel}>Nombre</Text>
      <Text style={styles.userValue}>{user?.displayName || '-'}</Text>
      <Text style={styles.userLabel}>Email</Text>
      <Text style={styles.userValue}>{user?.email || '-'}</Text>
      <Text style={styles.userLabel}>Edad</Text>
      {editMode ? (
        <TextInput
          style={styles.userValue}
          value={form.edad ?? ''}
          onChangeText={v => setForm(f => ({ ...f, edad: v }))}
          keyboardType="numeric"
          placeholder="Edad"
        />
      ) : (
        <Text style={styles.userValue}>{extraData.edad ?? '-'}</Text>
      )}
      <Text style={styles.userLabel}>Objetivo</Text>
      {editMode ? (
        <TextInput
          style={styles.userValue}
          value={form.objetivo ?? ''}
          onChangeText={v => setForm(f => ({ ...f, objetivo: v }))}
          placeholder="Objetivo"
        />
      ) : (
        <Text style={styles.userValue}>{extraData.objetivo ?? '-'}</Text>
      )}
      {/* Botón de editar datos dentro de la tabla */}
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        {editMode ? (
          <TouchableOpacity style={styles.editButton} onPress={onSave}>
            <Text style={styles.editButtonText}>Guardar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Editar datos</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 24,
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
