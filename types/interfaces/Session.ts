// Interfaz para la sesión de ejercicio
export interface ExerciseSession {
  id?: string;
  userId: string;
  routineId: string;
  routineName: string;
  date: string;
  exercises: ExerciseData[];
  routineDays?: string[];
}

export interface ExerciseData {
  name: string;
  series: Serie[];
}

export interface Serie {
  reps: string;
  weight: string;
}
