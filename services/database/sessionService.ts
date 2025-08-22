// Servicio para sesiones de ejercicio
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { ExerciseSession } from '../../types';

// Crear sesión de ejercicio
export const createSession = async (session: Partial<ExerciseSession>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), session);
    return docRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Obtener sesión por ID
export const getSessionById = async (sessionId: string): Promise<ExerciseSession | null> => {
  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
    if (sessionDoc.exists()) {
      return { id: sessionDoc.id, ...sessionDoc.data() } as ExerciseSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Obtener sesiones de un usuario
export const getUserSessions = async (userId: string): Promise<ExerciseSession[]> => {
  try {
    const q = query(
      collection(db, 'sessions'), 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const sessions: ExerciseSession[] = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() } as ExerciseSession);
    });
    return sessions;
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
};

// Obtener la última sesión de un usuario
export const getLastUserSession = async (userId: string): Promise<ExerciseSession | null> => {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ExerciseSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting last session:', error);
    throw error;
  }
};
