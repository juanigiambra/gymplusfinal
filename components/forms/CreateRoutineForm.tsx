import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Routine } from '../../types/routine';

export default function CreateRoutineForm({ onCreate }: { onCreate?: (routine: Partial<Routine>) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      const routine: Partial<Routine> = { name, description };
      if (onCreate) onCreate(routine);
      setName('');
      setDescription('');
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Nombre de la rutina</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ej: Piernas, Pecho, Cardio..."
      />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Agrega una breve descripción"
        multiline
      />
      <Button title="Crear rutina" onPress={handleCreate} disabled={!name.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
});
