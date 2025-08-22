// Archivo de índice para exportar todos los servicios
export * from './firebase';
export * from './auth/authService';
// Renombramos para evitar conflictos de nombres
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile as updateUserProfileData
} from './database/userService';
export * from './database/routineService';
export * from './database/sessionService';
export * from './storage/storageService';
export * from './api/apiNinja';
