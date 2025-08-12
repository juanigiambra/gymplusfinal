// Configuración de Firebase para la app. Incluye claves y servicios utilizados.
// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage  from "@react-native-async-storage/async-storage";
// TODO: Agrega los SDKs de Firebase que necesites
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuración de la app web de Firebase
// Para Firebase JS SDK v7.20.0 y posteriores, measurementId es opcional
export const firebaseConfig = {
  apiKey: "AIzaSyC7s1bxWtRMfXfHSMMYP3jIN_q4xKGxRlY",
  authDomain: "gymplustestjg.firebaseapp.com",
  projectId: "gymplustestjg",
  storageBucket: "gymplustestjg.firebasestorage.app",
  messagingSenderId: "651480994774",
  appId: "1:651480994774:web:9435b6ea500e001d670a77",
  measurementId: "G-223QB7V9L2"
};

// Inicializa Firebase y sus servicios
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);
const storage = getStorage(app);