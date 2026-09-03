import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Ionicons from '@react-native-vector-icons/ionicons'
import { colors, radius, shadow, spacing, screenStyles } from '../../theme'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { FILTERS, selectFilter, selectTaskStats } from '../../features/tasks/tasksSlice'
import { selectCurrentUser, setUserPhoto } from '../../features/auth/authSlice'
import { updateUserPhoto } from '../../services/profile/profileService'
import { logout } from '../../services/auth/authService'

const fallbackAvatar = require('../../assets/avatar.webp')

// Para un círculo perfecto el borderRadius tiene que ser
// exactamente la mitad del lado; '50%' no es confiable en RN.
const AVATAR_SIZE = 88

// Esta pantalla vive en OTRO tab y sin embargo lee el mismo store:
// completá una tarea en la lista y mirá cómo estos números se
// actualizan solos. Eso es el estado global en acción.
const ProfileScreen = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const { total, completed, pending } = useAppSelector(selectTaskStats)
  const filter = useAppSelector(selectFilter)

  const [isSaving, setIsSaving] = useState(false)

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  const pickImage = async () => {
    // 1. Sin permiso 'granted' no se puede abrir la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a tu galería para cambiar la foto de perfil.'
      )
      return
    }

    // 2. Selector nativo con recorte cuadrado para el avatar
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    // 3. Si el usuario canceló, no hay assets para leer
    if (result.canceled) return

    await savePhoto(result.assets[0].uri)
  }

  const savePhoto = async (photoURL: string) => {
    setIsSaving(true)
    if (!user) return


    try {
      // Firestore primero (persistencia entre sesiones)...
      await updateUserPhoto(user.uid, photoURL)

      // ...y Redux después: toda la UI suscripta al store se entera ya.
      dispatch(setUserPhoto(photoURL))
    } catch (error) {
      console.error('Error al guardar la foto de perfil:', error)
      Alert.alert('Error', 'No se pudo guardar la foto. Probá de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error(
        'Error al cerrar sesión:',
        error
      )
    }
  }

  return (
    <View style={screenStyles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={pickImage}
          disabled={isSaving}
        >
          <Image
            source={user?.photoURL ? { uri: user.photoURL } : fallbackAvatar}
            style={styles.avatar}
          />
          {isSaving ? (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color={colors.surface} />
            </View>
          ) : (
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color={colors.surface} />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>
          {user?.displayName ?? user?.email ?? 'Mi cuenta'}
        </Text>
        <Text style={styles.role}>Estudiante de Desarrollo de Apps</Text>
        <Text style={styles.hint}>Tocá la foto para cambiarla</Text>
      </View>

      <Text style={styles.sectionLabel}>Mis números (en vivo, desde el store)</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Tareas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.success }]}>{completed}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso general</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.filterNote}>
          Filtro activo en la lista: <Text style={styles.filterValue}>{FILTERS[filter]}</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    boxShadow: shadow.card
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginBottom: spacing.sm
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink
  },
  role: {
    fontSize: 14,
    color: colors.muted
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    boxShadow: shadow.card
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600'
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    boxShadow: shadow.card
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.success
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.success
  },
  filterNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs
  },
  filterValue: {
    fontWeight: '800',
    color: colors.ink
  },
  logoutButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
  },

  logoutText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 15,
  },
})
