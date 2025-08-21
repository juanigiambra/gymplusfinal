import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Serie {
  reps: string;
  weight: string;
}

interface ExerciseSeriesInputProps {
  exercise: string;
  series: Serie[];
  onInputChange: (serieIdx: number, field: 'reps' | 'weight', value: string) => void;
  onAddSerie: () => void;
  onRemoveSerie: (serieIdx: number) => void;
  colors: any;
}

const ExerciseSeriesInput: React.FC<ExerciseSeriesInputProps> = ({
  exercise,
  series,
  onInputChange,
  onAddSerie,
  onRemoveSerie,
  colors,
}) => {
  return (
    <View style={styles.exerciseRow}>
      <Text style={styles.exerciseName} numberOfLines={1} ellipsizeMode="tail">{exercise}</Text>
      {series.map((serie, serieIdx, arr) => (
        <View key={serieIdx} style={styles.inputsRow}>
          <Text style={styles.serieLabel}>Serie: {serieIdx + 1}</Text>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder={`Reps`}
            keyboardType="numeric"
            value={serie.reps}
            onChangeText={val => onInputChange(serieIdx, 'reps', val)}
            placeholderTextColor="#7da6e3"
          />
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder={`Peso`}
            keyboardType="numeric"
            value={serie.weight}
            onChangeText={val => onInputChange(serieIdx, 'weight', val)}
            placeholderTextColor="#7da6e3"
          />
          {arr.length > 1 && (
            <TouchableOpacity
              style={styles.trashButton}
              onPress={() => onRemoveSerie(serieIdx)}
            >
              <FontAwesome name="trash" size={20} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.addSerieButton} onPress={onAddSerie}>
        <Text style={styles.addSerieButtonText}>+ Agregar serie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseRow: {
    backgroundColor: '#f7faff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#b3d1ff',
    alignItems: 'center',
  },
  exerciseName: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b3d1ff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 15,
    color: '#357ae8',
  },
  inputSmall: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 60,
    maxWidth: 80,
  },
  addSerieButton: {
    backgroundColor: '#b3d1ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 4,
  },
  addSerieButtonText: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  serieLabel: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  trashButton: {
    marginLeft: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExerciseSeriesInput;
