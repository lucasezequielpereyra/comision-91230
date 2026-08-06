/* ════════════════════════════════════════════════════════════════════════════
 * src/screens/FlatListScreen.tsx · LA LISTA, HECHA BIEN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * La forma CORRECTA de mostrar una lista en React Native.
 *
 * FlatList es una lista VIRTUALIZADA: en vez de crear una vista nativa por cada
 * elemento de los datos, mantiene vivas solo las que están en pantalla (más un
 * margen arriba y abajo) y RECICLA las que salen. Con 10.000 tareas, hay ~10
 * vistas en memoria.
 *
 * Comparalo con `ScrollViewScreen`, que hace lo mismo con `.map()` y monta todo
 * de una. El badge de arriba te muestra la diferencia en números reales.
 *
 * ─── LAS TRES PROPS OBLIGATORIAS ─────────────────────────────────────────────
 *
 *   data         → el array de datos
 *   keyExtractor → cómo sacar el id único de cada elemento
 *   renderItem   → cómo dibujar UN elemento
 *
 * Es un cambio de mentalidad respecto de `.map()`: vos no dibujás la lista.
 * Le das los datos y una receta, y FlatList decide QUÉ y CUÁNDO dibujar.
 * ════════════════════════════════════════════════════════════════════════════ */

import { useCallback } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Task } from '../types'
import { spacing, colors } from '../theme'
import TaskItem from '../components/TaskItem'
import EmptyState from '../components/EmptyState'
import MountBadge, { useMountCounter } from '../components/MountBadge'

type Props = {
  /** Las tareas a mostrar. Vienen de `App.tsx`: esta pantalla NO las guarda,
   *  solo las recibe y las dibuja. */
  tasks: Task[]
  /** Avisa que hay que completar/descompletar una tarea. */
  onToggle: (id: string) => void
  /** Avisa que el usuario quiere ver el detalle de una tarea. */
  onSelect: (task: Task) => void
}

/* ─── keyExtractor ────────────────────────────────────────────────────────────
 *
 * Le dice a FlatList de dónde sacar la `key` de cada fila. Es el equivalente a
 * escribir `key={task.id}` cuando usás `.map()`, pero como acá FlatList arma
 * los elementos por vos, hay que enseñarle cómo hacerlo.
 *
 * ⚠️ Fijate que está definida FUERA del componente. Eso NO es un detalle de
 * estilo: si la escribiéramos adentro, JavaScript crearía una función nueva en
 * cada render, FlatList vería una prop distinta y podría rehacer trabajo al
 * pedo. Como esta función no depende de nada del componente, sacarla afuera es
 * gratis y garantiza que la referencia sea siempre la misma.
 *
 * (Si FlatList no encuentra keyExtractor, usa `item.key`, después `item.id`, y
 * si no hay ninguno cae al índice — que es justo lo que queremos evitar.) */
const keyExtractor = (item: Task) => item.id

const FlatListScreen = ({ tasks, onToggle, onSelect }: Props) => {
  // Nuestro instrumento de medición (ver src/components/MountBadge.tsx).
  const { mounted, onMountChange } = useMountCounter()

  /* Cuántas quedan pendientes. Otro caso de ESTADO DERIVADO: se calcula a
   * partir de `tasks` en cada render, no se guarda. `filter` devuelve un array
   * nuevo con los que cumplen la condición; `.length` nos da el conteo. */
  const pending = tasks.filter((t) => !t.completed).length

  /* ─── renderItem: LA RECETA PARA DIBUJAR UNA FILA ──────────────────────────
   *
   * FlatList llama a esta función cada vez que necesita mostrar un elemento, y
   * le pasa un objeto con varias cosas adentro. Nosotros desestructuramos solo
   * la que nos interesa:
   *
   *     ({ item }) => ...
   *       │
   *       └── también vienen `index`, `separators`, etc.
   *
   * ⚠️ El parámetro se llama `item`, NO `task`. Es el nombre que usa la API de
   * FlatList; podés renombrarlo al desestructurar (`{ item: task }`) pero no
   * cambiarlo en la firma.
   *
   * ─── ¿POR QUÉ useCallback ACÁ? ─────────────────────────────────────────────
   *
   * `useCallback` memoriza la función: mientras sus dependencias no cambien,
   * devuelve SIEMPRE la misma referencia en lugar de crear una nueva.
   *
   * Sin él, cada render de esta pantalla crearía un `renderItem` distinto,
   * FlatList lo interpretaría como "cambió cómo se dibujan las filas" y
   * repintaría todo. Y peor: anularía por completo el `memo()` de `TaskItem`,
   * porque las props que este entrega serían nuevas cada vez.
   *
   * La cadena de optimización tiene tres eslabones y necesita los tres:
   *   1. `onToggle`/`onSelect` memorizadas con useCallback  (en App.tsx)
   *   2. `renderItem` memorizado con useCallback            (acá)
   *   3. `TaskItem` envuelto en memo()                      (en TaskItem.tsx)
   * Si falta uno, los otros dos no sirven de nada. */
  const renderItem = useCallback(
    ({ item }: { item: Task }) => {
      return (
        <TaskItem task={item} onToggle={onToggle} onPress={onSelect} onMountChange={onMountChange} />
      )
    },
    /* El array de dependencias: "recreá esta función SOLO si alguna de estas
       cambia". Van todas las variables de afuera que la función usa adentro.
       Como las tres están memorizadas en su origen, en la práctica esto se
       crea una sola vez. */
    [onToggle, onSelect, onMountChange]
  )

  return (
    <View style={styles.container}>
      {/* ─── ENCABEZADO ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mis tareas</Text>
          {/* Burbuja con el número de pendientes. */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{pending}</Text>
          </View>
        </View>

        {/* Mensaje que cambia según el contexto: si no queda nada pendiente
            pero SÍ hay tareas, felicitamos; si no, explicamos qué hacer.
            La segunda condición (`tasks.length > 0`) evita el mensaje absurdo
            "¡Todo completado!" cuando en realidad no hay ninguna tarea. */}
        <Text style={styles.subtitle}>
          {pending === 0 && tasks.length > 0
            ? '¡Todo completado! 🎉'
            : 'Tocá una tarea para ver su detalle'}
        </Text>

        {/* El medidor solo tiene sentido si hay algo que medir. */}
        {tasks.length > 0 && <MountBadge mounted={mounted} total={tasks.length} />}
      </View>

      {/* ═══ LA FLATLIST ═════════════════════════════════════════════════════ */}
      <FlatList
        /* Los datos crudos. FlatList decide cuáles renderizar. */
        data={tasks}
        /* Cómo obtener el id único de cada uno. */
        keyExtractor={keyExtractor}
        /* Cómo dibujar uno. */
        renderItem={renderItem}
        /* ⚠️ DISTINCIÓN IMPORTANTE:
             `style`                → estiliza el CONTENEDOR SCROLLEABLE (la ventanita)
             `contentContainerStyle` → estiliza el CONTENIDO que scrollea adentro
           Si ponés el padding en `style`, se recorta el área visible y las filas
           quedan cortadas al hacer scroll. El padding va acá. */
        contentContainerStyle={styles.listContent}
        /* Qué mostrar cuando `data` está vacío. FlatList lo maneja solo: no hace
           falta un `if` afuera. (ScrollView no tiene nada parecido — mirá cómo
           se resuelve a mano en ScrollViewScreen.) */
        ListEmptyComponent={<EmptyState />}

        /* ─── TUNING DE VIRTUALIZACIÓN ─────────────────────────────────────
           Estos tres números controlan cuánto trabaja FlatList. Los valores por
           defecto (10 / 21 / 10) están bien para la mayoría de los casos; acá
           los bajamos un poco para que el efecto se note en la demo.

           Probá en clase: subí `initialNumToRender` a 50 y mirá cómo el badge
           salta a "50 de 50 montados" — o sea, desactivaste la virtualización
           sin darte cuenta. Es el error más común al "optimizar" listas. */

        /* Cuántas filas dibuja en el primer render. Debe alcanzar para llenar
           la pantalla: si es muy bajo, se ve un hueco blanco al abrir. */
        initialNumToRender={8}
        /* El "margen de seguridad", medido en pantallas. 7 significa que
           mantiene vivo el equivalente a 7 pantallas de contenido (unas 3 para
           cada lado). Más alto = scroll más suave pero más memoria. Más bajo =
           menos memoria pero podés ver parpadeos al scrollear rápido. */
        windowSize={7}
        /* Cuántas filas agrega por tanda mientras scrolleás. Números altos
           traban el scroll (mucho trabajo de una); bajos muestran huecos. */
        maxToRenderPerBatch={8}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    /* `flex: 1` acá es OBLIGATORIO y es el error #1 con listas: una FlatList
       necesita que sus contenedores tengan altura definida. Si algún ancestro
       en la cadena se olvida el `flex: 1`, la lista colapsa a altura 0 y no se
       ve nada — sin ningún mensaje de error. Cuando "la lista no aparece",
       revisá esto primero. */
    flex: 1,
    gap: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink
  },
  counter: {
    backgroundColor: colors.primarySoft,
    /* `minWidth` + `paddingHorizontal`: la burbuja es un círculo cuando el
       número tiene una cifra, y se ensancha sola si llega a tres. Con `width`
       fijo, el "100" quedaría cortado. */
    minWidth: 32,
    height: 32,
    borderRadius: 16, // la mitad del height = círculo
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  counterText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted
  },
  listContent: {
    // Aire al final para que la última tarjeta no quede pegada al borde.
    paddingBottom: spacing.xl,
    /* `flexGrow: 1` hace que el contenido ocupe como mínimo todo el alto
       disponible. Es lo que permite que el EmptyState se vea centrado en la
       pantalla en lugar de apretado arriba. Sin esto, el contenido de una
       lista vacía mide 0 y el mensaje queda pegado al encabezado. */
    flexGrow: 1
  }
})

export default FlatListScreen
