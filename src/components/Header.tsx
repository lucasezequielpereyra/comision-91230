/* ════════════════════════════════════════════════════════════════════════════
 * src/components/Header.tsx · ENCABEZADO DE PERFIL (Clase 2)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * 📌 Este componente es de la CLASE 2. Lo usa `HomeScreen`, que ya no forma
 *    parte del flujo principal de la app (mirá `App.tsx`). Lo conservamos para
 *    que puedan comparar cómo evolucionó el proyecto.
 *
 * Es un buen ejemplo de COMPONENTE DE PRESENTACIÓN: recibe datos por props y
 * los dibuja. No tiene estado, no tiene lógica, no toma decisiones. Ese tipo de
 * componente es el más fácil de reutilizar, porque no depende de nada.
 * ════════════════════════════════════════════════════════════════════════════ */

import { View, Text, Image, StyleSheet } from 'react-native'
// Importar una imagen como si fuera un módulo funciona gracias a Metro (el
// empaquetador). Lo que hace que TypeScript no proteste es `declarations.d.ts`.
import avatar from '../assets/avatar.webp'
import { colors, shadows } from '../theme'

type HeaderProps = {
  /** Nombre a mostrar. */
  name: string
  /** Cantidad total de tareas. */
  totalTasks: number
}

/* Desestructuramos las props directamente en los parámetros de la función.
 *
 *   ({ name, totalTasks }: HeaderProps)   en vez de   (props: HeaderProps)
 *
 * Así escribimos `name` en el cuerpo en lugar de `props.name`. Es la convención
 * más usada en React y hace el código bastante más liviano de leer. */
const Header = ({ name, totalTasks }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* El contenedor del avatar define el tamaño; la imagen lo llena. */}
      <View style={styles.avatarHeader}>
        <Image
          // `source` acepta tanto una imagen local importada (como acá) como
          // un objeto con URL: `source={{ uri: 'https://...' }}`.
          source={avatar}
          /* Estilo inline: 100% del contenedor padre. Es aceptable para un caso
             puntual como este; cuando el estilo se repite o crece, conviene
             moverlo al StyleSheet. */
          style={{ width: '100%', height: '100%', borderRadius: 20 }}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text style={styles.headerText}>{name}</Text>
        {/* Interpolación: mezclamos texto fijo con una variable. Todo lo que
            va entre llaves dentro del JSX es JavaScript. */}
        <Text style={styles.headerSubText}>Total de tareas: {totalTasks}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: colors.cardBackgroundColor,
    boxShadow: shadows.cardShadow,
    flexDirection: 'row', // avatar y textos en fila
    gap: 16,
    padding: 16,
    alignItems: 'center' // centrados verticalmente entre sí
  },
  avatarHeader: {
    width: 55,
    height: 55,
    borderRadius: 20
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24
  },
  headerSubText: {
    fontSize: 16
  }
})

export default Header
