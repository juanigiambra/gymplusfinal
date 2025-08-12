// Configuración y exportación de instancias de Firebase para toda la app.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);
// Exporta la instancia de autenticación
export const auth = getAuth(app);
// Exporta la instancia de Firestore
export const db = getFirestore(app);
