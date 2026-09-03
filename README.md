# TaskFlow 📱

App móvil para gestionar tareas, construida con **React Native + Expo** durante el curso
*Desarrollo de Aplicaciones* de Coderhouse. Proyecto final del programa (Módulo 8).

## Funcionalidades

- **Autenticación** con Firebase Auth: registro, login y logout, con sesión persistente
  entre reinicios de la app (AsyncStorage).
- **Tareas en la nube**: alta, completado y borrado sincronizados en tiempo real con
  Firestore (`onSnapshot`), separadas por usuario (`userId == uid`).
- **Estado global** con Redux Toolkit: slices de `tasks` y `auth`, selectores memoizados
  con `createSelector`.
- **Navegación profesional**: Bottom Tabs (Tareas / Perfil) + Stacks anidados, con rutas
  protegidas por renderizado condicional (`user ? <TabNavigator /> : <AuthStack />`).
- **Perfil con foto** (Módulo 8): selección de avatar desde la galería con
  `expo-image-picker` (permisos, recorte 1:1, compresión), persistida en `users/{uid}`
  de Firestore y sincronizada vía Redux en toda la UI (Perfil y header de la lista).

## Cómo ejecutarla

```bash
npm install
npx expo start
```

Escaneá el código QR con **Expo Go** (Android/iOS) o presioná `a` para abrir el emulador
de Android.

> La configuración de Firebase vive en `src/config/firebase.ts`. Si clonás el proyecto
> para usar tu propio Firebase, copiá `src/config/firebase.example.ts` y completá las
> credenciales de tu app **Web** registrada en la consola.

## Estructura

```
src/
├── components/    # UI reutilizable (TaskItem, TaskForm, FilterBar, ...)
├── config/        # Inicialización de Firebase (singleton)
├── features/      # Slices de Redux Toolkit (tasks, auth)
├── navigation/    # RootNavigator, Tabs y Stacks
├── screens/       # Pantallas (auth, tasks, profile)
├── services/      # Capa de acceso a datos (auth, tasks, profile)
├── store/         # configureStore + hooks tipados
└── theme/         # Colores, espaciado, sombras
```

## Reglas de seguridad de Firestore

Solo usuarios autenticados acceden a sus propios datos:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, delete: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId
                    && request.auth.uid == request.resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Evidencia visual

<!-- TODO (entrega final): agregar capturas o un GIF corto mostrando
     login → lista de tareas → cambio de foto de perfil. -->

## Despliegue

Para compartir la app según pide la entrega:

```bash
npx eas update   # publica una actualización accesible desde Expo Go
```

(Requiere cuenta de Expo y `eas init` la primera vez.)
