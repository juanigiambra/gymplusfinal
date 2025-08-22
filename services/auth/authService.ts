// Servicio de autenticación
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

// Registro de usuario
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login de usuario
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string }): Promise<void> => {
  try {
    await updateProfile(user, data);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
