/* ════════════════════════════════════════════════════════════════════════════
 * src/screens/HomeScreen.tsx · LA PANTALLA DE LA CLASE 2
 * ════════════════════════════════════════════════════════════════════════════
 *
 * 📌 Esta pantalla ya NO se usa: `App.tsx` hoy renderiza `FlatListScreen` /
 *    `ScrollViewScreen` / `TaskDetailScreen`. La conservamos como referencia.
 *
 * ─── ¿POR QUÉ VALE LA PENA MIRARLA? ──────────────────────────────────────────
 *
 * Porque muestra el punto de partida. Comparala con `FlatListScreen`:
 *
 *   HomeScreen (Clase 2)              FlatListScreen (Clase 4)
 *   ────────────────────              ────────────────────────
 *   Datos importados directo          Datos que llegan por props
 *   `tasks.map()` a mano              FlatList virtualizada
 *   Sin scroll (se corta y ya)        Scroll con reciclado de vistas
 *   Nada es tocable                   Toggle, detalle, alta y baja
 *   Sin estado: siempre igual         useState: la app cambia con el uso
 *
 * La diferencia central es de dónde vienen los datos. Acá `HomeScreen` los
 * importa por su cuenta (`import { tasks } from '../data'`), lo que la ata a
 * ese archivo para siempre: no la podés reutilizar con otra lista, ni testear
 * con datos falsos. En la Clase 4 los datos BAJAN POR PROPS desde `App.tsx`,
 * y la pantalla pasa a ser una pieza reutilizable.
 *
 * ⚠️ Actualizada al modelo nuevo de `Task` (`completed` en vez de `done`).
 * ════════════════════════════════════════════════════════════════════════════ */

import { View, Text, StyleSheet } from 'react-native'
import Header from '../components/Header'
import CardTask from '../components/CardTask'
// Los datos entran acá, no por props. Ese es el acoplamiento del que hablamos.
import { tasks, name } from '../data'
import { textSize } from '../theme'

const HomeScreen = () => {
  return (
    /* Fragment (<> </>): agrupa varios elementos sin agregar un <View> extra
       al layout. Lo usamos porque el contenedor con el padding y el `gap` ya
       lo pone `App.tsx`; meter otro acá duplicaría el espaciado. */
    <>
      <View style={styles.gretting}>
        {/* `.slice(0, 5)` corta el string y deja los primeros 5 caracteres
            ("Lucas Pereyra" → "Lucas"). Es un truco rápido para quedarse con
            el nombre de pila... que funciona solo si el nombre tiene 5 letras.
            Lo correcto sería `name.split(' ')[0]`: partir por el espacio y
            tomar el primer pedazo, sin importar el largo. */}
        <Text style={styles.grettingText}>Hola, buenas noches {name.slice(0, 5)}</Text>
      </View>

      {/* Le pasamos datos hacia abajo por props. `tasks.length` se calcula acá
          y baja ya resuelto: `Header` no necesita conocer el array entero. */}
      <Header name={name} totalTasks={tasks.length} />

      <View style={{ width: '100%', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: textSize.subtitle, fontWeight: 'bold' }}>
          {/* `filter` devuelve un array nuevo con las que cumplen la condición,
              y `.length` lo cuenta. Se recalcula en cada render: otro caso de
              ESTADO DERIVADO, no hace falta guardarlo. */}
          Tareas completadas {tasks.filter((task) => task.completed).length} / {tasks.length}
        </Text>
      </View>

      <View style={{ width: '100%', gap: 16 }}>
        {/* ═══ EL PATRÓN .map() ═════════════════════════════════════════════
            Recorremos el array y devolvemos un componente por cada tarea.
            Funciona perfecto para listas cortas y fijas como esta.

            Sus dos límites (y por eso existe la Clase 4):
              1. No scrollea: si hay 50 tareas, las de abajo quedan fuera de
                 la pantalla y no hay forma de llegar a ellas.
              2. Monta todo de una: 500 tareas = 500 vistas nativas en memoria.

            La `key` acá SÍ está en el lugar correcto: en el elemento que
            devuelve el `.map()`. */}
        {tasks.map((task) => {
          return <CardTask key={task.id} task={task} />
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  // (El nombre tiene un typo: sería "greeting". Lo dejamos tal cual salió en
  // clase — pasa, y no rompe nada.)
  gretting: {
    width: '100%'
  },
  grettingText: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default HomeScreen
