// Copiá este archivo como firebase.ts y completá las credenciales de TU
// proyecto de Firebase (consola → configuración → app Web registrada).
// Recordá: con Expo Go se registra una app WEB, no iOS/Android.
import { getApps, initializeApp } from 'firebase/app'
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const persistence = getReactNativePersistence(ReactNativeAsyncStorage)

const firebaseConfig = {
  apiKey: 'AIzaSyB2ghf_fdIghSLP1XmMGcxi3nnBQ6NwjTA',
  authDomain: 'coder-dev-apps.firebaseapp.com',
  projectId: 'coder-dev-apps',
  storageBucket: 'coder-dev-apps.firebasestorage.app',
  messagingSenderId: '1067541983593',
  appId: '1:1067541983593:web:932595f72db2d8a94b4df8'
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

const auth = initializeAuth(app, {
  persistence
})

export { auth }

export const db = getFirestore(app)

export default app
