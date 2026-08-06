/* ════════════════════════════════════════════════════════════════════════════
 * src/components/MountBadge.tsx · EL MEDIDOR DE VIRTUALIZACIÓN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Este es el archivo más importante de la clase desde el punto de vista
 * conceptual, porque hace VISIBLE algo invisible.
 *
 * El problema: cuando decimos "FlatList es más eficiente que ScrollView", suena
 * a acto de fe. No se ve. La app anda igual con 14 tareas.
 *
 * La solución: contar cuántos ítems están realmente creados en memoria en este
 * instante, y mostrar el número en pantalla. Entonces podés cambiar de pestaña
 * y comparar con tus propios ojos:
 *
 *     Tab FlatList    →  ⚡ 8 de 14 ítems montados
 *     Tab ScrollView  →  🐢 14 de 14 ítems montados
 *
 * Eso es la VIRTUALIZACIÓN: FlatList mantiene vivos solo los ítems visibles
 * (más un margen de seguridad) y destruye el resto. ScrollView los crea todos
 * de una, estén o no en pantalla. Con 14 tareas da lo mismo; con 5.000 la
 * diferencia es que una app funciona y la otra se queda sin memoria.
 * ════════════════════════════════════════════════════════════════════════════ */

import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing } from '../theme'

/* ════════════════════════════════════════════════════════════════════════════
 * PARTE 1 · EL CUSTOM HOOK
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Un "custom hook" es simplemente una función que usa otros hooks adentro y
 * cuyo nombre empieza con `use`. No es magia ni una API especial de React: es
 * la forma de EMPAQUETAR lógica con estado para reutilizarla.
 *
 * ¿Por qué acá? Porque tanto `FlatListScreen` como `ScrollViewScreen` necesitan
 * exactamente el mismo contador. Sin el hook, habría que copiar y pegar el
 * `useState` y la función en las dos pantallas.
 *
 * ⚠️ El prefijo `use` es obligatorio: es lo que le permite a las herramientas
 * de React verificar que respetes las reglas de los hooks (no llamarlos dentro
 * de un `if`, ni de un `for`, ni después de un `return`).
 *
 * Dato clave: cada pantalla que llama a `useMountCounter()` obtiene su PROPIO
 * contador independiente. Los hooks comparten la lógica, nunca los datos. */
export function useMountCounter() {
  // El número de ítems vivos en este momento. Arranca en 0 porque al principio
  // no hay ninguno montado.
  const [mounted, setMounted] = useState(0)

  /* Esta función se le pasa a cada TaskItem. Cuando el ítem nace, la llama y
   * suma 1. Y devuelve OTRA función que, al ejecutarse, resta 1. Ese patrón
   * (una función que devuelve su propia función de limpieza) es exactamente
   * lo que `useEffect` espera recibir. */
  const onMountChange = useCallback(() => {
    /* Actualización FUNCIONAL del estado: le pasamos a `setMounted` una
     * función en lugar de un valor.
     *
     *   ❌ setMounted(mounted + 1)
     *   ✅ setMounted((prev) => prev + 1)
     *
     * ¿Por qué importa? Porque `mounted` es el valor que había cuando se creó
     * esta función. Si FlatList monta 8 ítems en la misma tanda, los 8 leerían
     * `mounted === 0` y el resultado final sería 1 en vez de 8.
     *
     * Con la forma funcional, React aplica los cambios en cadena: cada llamada
     * recibe el valor MÁS RECIENTE. Es la regla de oro cuando el estado nuevo
     * depende del anterior. */
    setMounted((prev) => prev + 1)

    // El cleanup: se ejecuta cuando el ítem se desmonta (FlatList lo recicla
    // porque salió de pantalla, o se borró la tarea).
    return () => setMounted((prev) => prev - 1)
  }, [])
  /*     ↑
   * El array de dependencias vacío significa: "creá esta función UNA sola vez
   * y devolvé siempre la misma referencia".
   *
   * Esto es crítico acá. `TaskItem` la usa dentro de un `useEffect` cuya
   * dependencia es justamente `onMountChange`. Si en cada render de la pantalla
   * naciera una función nueva, el efecto se dispararía otra vez, el ítem se
   * contaría de nuevo... y el contador se volvería loco.
   *
   * Podemos dejar el array vacío sin riesgo porque el cuerpo de la función no
   * lee ninguna variable de afuera: `setMounted` es estable, React lo garantiza. */

  // Devolvemos un objeto (no un array) para que quien lo use tenga nombres
  // claros: `const { mounted, onMountChange } = useMountCounter()`.
  return { mounted, onMountChange }
}

/* ════════════════════════════════════════════════════════════════════════════
 * PARTE 2 · EL COMPONENTE VISUAL
 * ════════════════════════════════════════════════════════════════════════════ */

type Props = {
  /** Cuántos ítems están montados AHORA. */
  mounted: number
  /** Cuántas tareas hay en total. */
  total: number
}

export default function MountBadge({ mounted, total }: Props) {
  /* Regla simple para pintar el badge de verde o de rojo: si estamos montando
   * la mitad o menos del total, la virtualización está trabajando (verde ⚡).
   * Si están todos montados, no hay virtualización (rojo 🐢).
   *
   * Este valor NO necesita su propio `useState`: se puede calcular a partir de
   * las props en cada render. Se llama ESTADO DERIVADO, y la regla es clara:
   * si podés calcularlo, calculalo — no lo guardes. Estado duplicado es estado
   * que tarde o temprano se desincroniza. */
  const good = mounted <= total / 2

  return (
    /* Un array de estilos: React Native los fusiona de izquierda a derecha,
       igual que el spread de objetos. El segundo pisa lo que repite del
       primero. Acá: estilo base + la variante de color según `good`. */
    <View style={[styles.badge, good ? styles.good : styles.bad]}>
      <Text style={[styles.text, good ? styles.goodText : styles.badText]}>
        {/* Interpolación: todo lo que va entre llaves dentro del JSX es
            JavaScript común. Acá metemos un operador ternario y dos variables
            en el medio del texto. */}
        {good ? '⚡' : '🐢'} {mounted} de {total} ítems montados en memoria
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    /* `alignSelf: 'flex-start'` hace que el badge ocupe SOLO el ancho de su
       contenido, en lugar de estirarse a lo ancho del contenedor.
       Por defecto en React Native los hijos se estiran (`alignSelf: 'stretch'`),
       que es justo lo que no queremos en una etiqueta. */
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill, // forma de píldora
    borderWidth: 1
  },
  // Variante "todo bien": fondo verde pastel + borde verde fuerte.
  good: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success
  },
  // Variante "ojo acá": la misma estructura en rojo.
  bad: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger
  },
  text: {
    fontSize: 12,
    fontWeight: '700'
  },
  // El color del texto va aparte del fondo para poder combinarlos por separado.
  goodText: { color: colors.success },
  badText: { color: colors.danger }
})
