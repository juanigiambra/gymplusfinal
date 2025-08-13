# GymPlus

GymPlus es una aplicación móvil desarrollada con Expo y React Native que permite a los usuarios gestionar sus rutinas de entrenamiento, registrar sesiones, visualizar estadísticas y personalizar su perfil. El objetivo es facilitar el seguimiento del progreso físico y la organización de rutinas personalizadas.

## Herramientas utilizadas

- **Expo**: Plataforma para desarrollar y ejecutar aplicaciones React Native de forma sencilla y rápida.
- **React Native**: Framework para crear aplicaciones móviles nativas usando JavaScript y React.
- **Expo Router**: Sistema de navegación basado en archivos, que permite definir rutas protegidas y públicas.
- **Firebase Auth**: Servicio de autenticación de usuarios, utilizado para el registro e inicio de sesión.
- **Firebase Firestore**: Base de datos NoSQL en tiempo real, donde se almacenan rutinas, sesiones y datos de usuario.
- **Firebase Storage**: Almacenamiento de imágenes de perfil de usuario.
- **API Ninja**: Servicio externo para obtener información detallada de ejercicios y enriquecer la base de datos de rutinas.
- **react-native-calendars**: Componente de calendario interactivo para visualizar las sesiones realizadas.
- **react-native-chart-kit**: Librería para mostrar gráficas y estadísticas de progreso en los ejercicios.
- **@expo/vector-icons**: Iconos personalizables para mejorar la interfaz de usuario.
- **@react-native-picker/picker**: Selector de opciones en formularios y pantallas de edición.

## Funcionalidades principales

- Registro e inicio de sesión seguro (Firebase Auth).
- Creación, edición y eliminación de rutinas personalizadas.
- Registro de sesiones de entrenamiento con fecha, ejercicios, repeticiones y peso.
- Visualización de calendario con las sesiones realizadas.
- Estadísticas gráficas del progreso en cada ejercicio.
- Edición de perfil e imagen de usuario.
- Navegación protegida: solo usuarios autenticados pueden acceder a las funciones principales.
