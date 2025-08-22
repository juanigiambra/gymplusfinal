// Servicio de almacenamiento para imágenes
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Subir imagen
export const uploadImage = async (
  file: Blob, 
  path: string, 
  fileName: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${fileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Subir imagen de perfil
export const uploadProfileImage = async (userId: string, file: Blob): Promise<string> => {
  return uploadImage(file, 'profile', `${userId}_profile`);
};

// Eliminar imagen
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
