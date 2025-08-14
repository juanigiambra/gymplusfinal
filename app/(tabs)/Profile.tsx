// Componente de perfil de usuario. Permite ver y editar datos personales, y cerrar sesión.
import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeToggle, getTheme } from '../../hooks/useTheme';
import { auth, db } from '../../services/firebase';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import UserDataTable from '../../components/UserDataTable';
import ProfileImageEditor from '../../components/ProfileImageEditor';

export const options = {
  headerShown: false,
};

export default function Profile() {
  const { theme } = useThemeToggle();
  const colors = getTheme(theme);
  // Estado para modo edición de datos
  const [editMode, setEditMode] = React.useState(false);
  // Estado para los datos del formulario de edición
  const [form, setForm] = React.useState<{ edad?: string; objetivo?: string }>({});
  const router = useRouter();
  // Usuario autenticado actual
  const user = auth.currentUser;
  // Estado para datos extra guardados en Firestore
  const [extraData, setExtraData] = React.useState<{ edad?: number; objetivo?: string }>({});
  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = React.useState<string | null>(null);

  // Al montar, obtiene los datos extra del usuario desde Firestore
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setExtraData(userDoc.data() as { edad?: number; objetivo?: string });
          setForm({
            edad: userDoc.data().edad ? String(userDoc.data().edad) : '',
            objetivo: userDoc.data().objetivo || '',
          });
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Al montar, obtiene la imagen de perfil si existe
  React.useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.uid) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, `profileImages/${user.uid}`);
          const url = await getDownloadURL(imageRef);
          setProfileImage(url);
        } catch (e) {
          setProfileImage(null); // No hay imagen
        }
      }
    };
    fetchProfileImage();
  }, [user]);

  // Cierra la sesión y redirige al login
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  // Activa modo edición
  const handleEdit = () => setEditMode(true);

  // Guarda los datos editados en Firestore
  const handleSave = async () => {
    if (user?.uid) {
      await setDoc(doc(db, 'users', user.uid), {
        edad: form.edad ? Number(form.edad) : undefined,
        objetivo: form.objetivo || undefined,
      }, { merge: true });
      setExtraData({ edad: form.edad ? Number(form.edad) : undefined, objetivo: form.objetivo });
      setEditMode(false);
    }
  };

  // Maneja la selección y subida de imagen de perfil
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const storage = getStorage();
      const imageRef = ref(storage, `profileImages/${user?.uid}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      setProfileImage(url);
      // Opcional: guardar la URL en Firestore
      if (user?.uid) {
        await setDoc(doc(db, 'users', user.uid), { profileImage: url }, { merge: true });
      }
    }
  };

  // Renderiza la interfaz de perfil
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.screenName, { color: colors.primary }]}>Perfil</Text>
      <View style={{ alignItems: 'center' }}>
        <ProfileImageEditor profileImage={profileImage} onEdit={handlePickImage} />
        <View style={{ height: 35 }} />
      </View>
      <UserDataTable
        user={{
          displayName: user?.displayName ?? undefined,
          email: user?.email ?? undefined,
        }}
        extraData={extraData}
        editMode={editMode}
        form={form}
        setForm={setForm}
        onEdit={handleEdit}
        onSave={handleSave}
      />
      <View style={[styles.rowButtons]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos para la pantalla de perfil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  userBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 280,
    shadowColor: '#357ae8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  userLabel: {
    color: '#357ae8',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  userValue: {
    color: '#222',
    fontSize: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#b3d1ff',
    paddingBottom: 4,
  },
  editButton: {
    backgroundColor: '#357ae8',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
    shadowColor: '#357ae8',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#e83535',
    paddingVertical: 14,
    borderRadius: 24,
    width: 140,
    alignItems: 'center',
    marginTop: 32,
    alignSelf: 'center',
    shadowColor: '#e83535',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  screenName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#357ae8',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 42, // antes 32, ahora 32+10
  },
});
