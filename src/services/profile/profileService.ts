import { doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from '../../config/firebase'

export type UserProfile = {
  photoURL: string | null
}

// El perfil de cada usuario vive en un documento `users/{uid}`.
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, 'users', userId))

  if (!snapshot.exists()) return null

  const data = snapshot.data()

  return {
    photoURL: data.photoURL ?? null,
  }
}

export const updateUserPhoto = async (
  userId: string,
  photoURL: string
) => {
  // setDoc con merge y no updateDoc: el documento del usuario
  // puede no existir todavía (el registro solo crea la cuenta en Auth).
  await setDoc(
    doc(db, 'users', userId),
    { photoURL },
    { merge: true }
  )
}
