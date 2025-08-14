// Importaciones principales de React y librerías necesarias para la pantalla de inicio.
import React, { useEffect, useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { db, auth } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CustomCalendar from '../../components/CustomCalendar';
import LastSessionCard from '../../components/LastSessionCard';
import { useRouter } from 'expo-router';
import { useThemeToggle, getTheme } from '../../hooks/useTheme';
import { TouchableOpacity } from 'react-native';

// Componente principal de la pantalla de inicio (Home).
// Muestra el calendario de sesiones y el nombre del usuario autenticado.
export default function HomeScreenPage() {
    // Estado para almacenar las fechas marcadas en el calendario.
    const [markedDates, setMarkedDates] = useState({});
    // Referencia al usuario autenticado actual.
    const user = auth.currentUser;
    // Hook para navegación entre pantallas.
    const router = useRouter();
    // Hook para dark mode
    const { theme, toggleTheme } = useThemeToggle();
    const colors = getTheme(theme);

    // useEffect: verifica autenticación y obtiene las sesiones del usuario desde Firestore.
    useEffect(() => {
        // Si no hay usuario autenticado, redirige al login.
        if (!auth.currentUser) {
            router.push('/login');
            return;
        }
        // Función asincrónica para obtener las sesiones del usuario desde Firestore.
        const fetchSessions = async () => {
            if (!user?.uid) return;
            // Consulta todas las sesiones del usuario autenticado.
            const q = query(collection(db, 'sessions'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const dates: any = {};
            const allSessions: any[] = [];
            // Recorre cada sesión y marca la fecha en el calendario.
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allSessions.push(data);
                if (data.date) {
                    const dateStr = data.date.split('T')[0];
                    // Prueba de marcado simple: selected y marked
                    dates[dateStr] = {
                        selected: true,
                        marked: true,
                        selectedColor: '#357ae8',
                    };
                }
            });
            // Actualiza el estado con las fechas marcadas.
            setMarkedDates(dates);
        };
        fetchSessions();
    }, [user]);

    // Si no hay usuario autenticado, no renderiza nada.
    if (!auth.currentUser) return null;

    // Render principal: muestra el saludo, nombre de pantalla y el calendario personalizado.
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}> 
            <Text style={[styles.pageTitle, { color: colors.primary }]}>Bienvenido {user?.displayName || user?.email || ''}!</Text>
            <Text style={[styles.screenName, { color: colors.primary }]}>Inicio</Text>
            <CustomCalendar markedDates={markedDates} />
            <LastSessionCard />
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                <Text style={[styles.themeButtonText, { color: colors.primary }]}>Modo {theme === 'light' ? 'Oscuro' : 'Claro'}</Text>
            </TouchableOpacity>
        </View>
    );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 32) + 25) : 57,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 18,
    },
    screenName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    calendar: {
        marginTop: 12,
        borderRadius: 12,
        width: '92%',
        elevation: 2,
        shadowColor: '#357ae8',
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    themeButton: {
        alignSelf: 'center',
        marginTop: 18,
        marginBottom: 18,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    themeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});
