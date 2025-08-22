// Servicio para rutinas de ejercicio
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Routine } from '../../types';

// Crear rutina
export const createRoutine = async (routine: Partial<Routine>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'routines'), routine);
    return docRef.id;
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

// Obtener rutina por ID
export const getRoutineById = async (routineId: string): Promise<Routine | null> => {
  try {
    const routineDoc = await getDoc(doc(db, 'routines', routineId));
    if (routineDoc.exists()) {
      return { id: routineDoc.id, ...routineDoc.data() } as Routine;
    }
    return null;
  } catch (error) {
    console.error('Error getting routine:', error);
    throw error;
  }
};

// Obtener rutinas de un usuario
export const getUserRoutines = async (userId: string): Promise<Routine[]> => {
  try {
    const q = query(collection(db, 'routines'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const routines: Routine[] = [];
    querySnapshot.forEach((doc) => {
      routines.push({ id: doc.id, ...doc.data() } as Routine);
    });
    return routines;
  } catch (error) {
    console.error('Error getting user routines:', error);
    throw error;
  }
};

// Actualizar rutina
export const updateRoutine = async (routineId: string, routine: Partial<Routine>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'routines', routineId), routine);
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

// Eliminar rutina
export const deleteRoutine = async (routineId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'routines', routineId));
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};
