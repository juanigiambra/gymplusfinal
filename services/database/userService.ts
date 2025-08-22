// Servicio de usuarios para operaciones de base de datos
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, UserData } from '../../types';

// Crear perfil de usuario
export const createUserProfile = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
