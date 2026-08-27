import { getApps, initializeApp } from 'firebase/app'
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const persistence = getReactNativePersistence(ReactNativeAsyncStorage);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI5Nur_ghkqXVULzLtGxmyGWdmn91K6-Q",
  authDomain: "taskflow-91230.firebaseapp.com",
  projectId: "taskflow-91230",
  storageBucket: "taskflow-91230.firebasestorage.app",
  messagingSenderId: "92066779523",
  appId: "1:92066779523:web:ef50ac156af229b98c26b6"
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]

const auth = initializeAuth(app, {
  persistence
});

export { auth }

export const db = getFirestore(app)

export default app