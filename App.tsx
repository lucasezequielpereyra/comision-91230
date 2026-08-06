/* ════════════════════════════════════════════════════════════════════════════
 * App.tsx · EL COMPONENTE RAÍZ · TASKFLOW (Clase 4)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Este archivo es EL CEREBRO de la aplicación. Todo lo demás son piezas que él
 * coordina. Si entendés este archivo, entendés la app.
 *
 * ─── EL ÁRBOL DE COMPONENTES ─────────────────────────────────────────────────
 *
 *   App.tsx  ← 🧠 acá vive TODO el estado
 *    │
 *    ├── ¿hay una tarea seleccionada?
 *    │    │
 *    │    ├── SÍ  → TaskDetailScreen ── (el detalle de esa tarea)
 *    │    │
 *    │    └── NO  → ¿qué pestaña está activa?
 *    │              ├── 'flatlist'   → FlatListScreen   ─┐
 *    │              └── 'scrollview' → ScrollViewScreen ─┴→ TaskItem × N
 *    │              └── TabBar        (para cambiar de pestaña)
 *    │              └── TaskForm      (el botón + el modal)
 *
 * ─── ¿POR QUÉ EL ESTADO ESTÁ TODO ACÁ? ───────────────────────────────────────
 *
 * Por el principio de LIFTING STATE UP: el estado se guarda en el ancestro común
 * más cercano de todos los componentes que lo necesitan.
 *
 * La lista de tareas la necesitan: FlatListScreen, ScrollViewScreen y (a través
 * de la tarea seleccionada) TaskDetailScreen. Además la modifican TaskForm y
 * TaskItem. El único lugar donde todos se encuentran es `App`.
 *
 * De ahí sale el flujo que se repite en toda la app:
 *
 *        LOS DATOS BAJAN por props        LOS EVENTOS SUBEN por callbacks
 *        ────────────────────────         ──────────────────────────────
 *        App → tasks → FlatListScreen     TaskItem → onToggle → App
 *            → task  → TaskItem                    ↑
 *                                          App es el ÚNICO que modifica
 *
 * Ningún componente de abajo cambia nada por su cuenta: AVISAN, y App decide.
 * Eso hace que, cuando algo anda mal, sepas exactamente dónde mirar.
 * ════════════════════════════════════════════════════════════════════════════ */

import React, { useCallback, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { TabKey, Task } from './src/types'
import { colors, spacing } from './src/theme'
import { SEED_TASKS } from './src/data/seed'

import FlatListScreen from './src/screens/FlatListScreen'
import ScrollViewScreen from './src/screens/ScrollViewScreen'
import TaskDetailScreen from './src/screens/TaskDetailScreen'
import TaskForm from './src/components/TaskForm'
import TabBar from './src/components/TabBar'

export default function App() {
  /* ═══ EL ESTADO ═══════════════════════════════════════════════════════════
   *
   * Tres `useState`, y con eso alcanza para toda la app. Fijate que cada uno
   * responde una pregunta distinta:
   *
   *   tasks        → ¿qué tareas hay?          (los DATOS)
   *   selectedTask → ¿estamos viendo un detalle? (la NAVEGACIÓN)
   *   activeTab    → ¿qué pestaña está activa?   (la NAVEGACIÓN)
   *
   * Separarlos es a propósito: cuando cambia uno, los otros no se tocan. */

  /** La lista de tareas. Arranca con las del seed.
   *
   *  El `<Task[]>` le dice a TypeScript que este estado guarda un array de
   *  tareas. Acá no sería estrictamente necesario (lo podría inferir de
   *  SEED_TASKS), pero escribirlo documenta la intención y evita sorpresas
   *  si mañana el valor inicial cambia a `[]`. */
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)

  /** La tarea que estamos mirando en detalle, o `null` si estamos en la lista.
   *
   *  Este único dato ES nuestra navegación: mientras sea `null`, se ve la
   *  lista; apenas tiene una tarea, se ve el detalle. */
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  /** La pestaña activa. */
  const [activeTab, setActiveTab] = useState<TabKey>('flatlist')

  /* ═══ LAS ACCIONES ════════════════════════════════════════════════════════
   *
   * Las cuatro funciones que modifican el estado. Bajan por props a los
   * componentes que las necesitan.
   *
   * ─── LA REGLA DE ORO: NUNCA MUTAR EL ESTADO ────────────────────────────────
   *
   * En React, el estado es INMUTABLE. Nunca se modifica el array existente:
   * siempre se crea uno NUEVO con el cambio aplicado.
   *
   *   ❌ tasks.push(nueva)          → modifica el array original
   *   ❌ tasks[0].completed = true  → modifica el objeto original
   *   ✅ setTasks([nueva, ...tasks])
   *   ✅ setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t))
   *
   * ¿Por qué tanto rigor? Porque React detecta cambios comparando REFERENCIAS
   * (con `===`), no contenidos. Si mutás el array, la referencia sigue siendo
   * la misma, React concluye "no cambió nada" y NO REDIBUJA. El dato cambió
   * pero la pantalla no. Es el bug más frustrante de aprender React, porque
   * no da ningún error: simplemente no pasa nada.
   *
   * Por eso usamos siempre métodos que DEVUELVEN UN ARRAY NUEVO
   * (`map`, `filter`, spread `...`) y nunca los que modifican el original
   * (`push`, `splice`, `sort`, asignación directa).
   *
   * ─── ¿POR QUÉ TODAS ENVUELTAS EN useCallback? ──────────────────────────────
   *
   * `useCallback` conserva la MISMA referencia de función entre renders. Es el
   * primer eslabón de la cadena de optimización de la lista:
   *
   *   useCallback acá  →  useCallback en renderItem  →  memo() en TaskItem
   *
   * Sin esto, cada render de App crearía funciones nuevas, las props de cada
   * fila cambiarían, y `memo()` no filtraría nada: se repintarían las 14 filas
   * cada vez que tocás un solo checkbox. */

  /** Agrega una tarea nueva al principio de la lista. La llama `TaskForm`. */
  const addTask = useCallback((task: Task) => {
    /* Forma FUNCIONAL de actualizar: le pasamos una función que recibe el
       valor anterior. Es lo correcto siempre que el valor nuevo dependa del
       viejo, porque React garantiza que `prev` es el estado MÁS RECIENTE.

       `[task, ...prev]` crea un array nuevo con la tarea adelante, seguida de
       todas las anteriores desparramadas por el spread. La tarea nueva va
       primera para que el usuario vea el resultado sin scrollear. */
    setTasks((prev) => [task, ...prev])
  }, [])
  /*      ↑ dependencias vacías: la función no lee ninguna variable de afuera
   *        (usa solo `prev`), así que se crea una vez y no cambia nunca. */

  /** Alterna una tarea entre completada y pendiente. */
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      /* `.map()` recorre el array y devuelve uno NUEVO del mismo largo.
         Para cada tarea preguntamos: ¿es la que buscamos?
           • Sí → devolvemos una COPIA con `completed` invertido
           • No → devolvemos la misma tarea, tal cual (misma referencia)

         Ese detalle importa: las tareas que no cambiaron conservan su
         referencia original, así que el `memo()` de TaskItem las reconoce
         como "iguales" y no las redibuja. Solo se repinta la que cambió.

         `{ ...t, completed: !t.completed }` se lee: "copiá todas las
         propiedades de t, y después pisá `completed` con su valor invertido".
         El orden importa — lo que va después gana. */
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )

    /* ⚠️ SINCRONIZACIÓN NECESARIA
       `selectedTask` guarda una COPIA de la tarea, no una referencia viva al
       elemento del array. Si el usuario completa la tarea desde la pantalla de
       detalle, actualizamos el array... pero el detalle seguiría mostrando la
       versión vieja.
       Por eso actualizamos también `selectedTask`, si resulta ser la misma.

       Esto es una consecuencia de tener el mismo dato guardado en dos lugares.
       En una app más grande se resuelve guardando solo el ID
       (`selectedId`) y buscando la tarea en el array al renderizar — así hay
       una sola fuente de verdad. Buen ejercicio para practicar. */
    setSelectedTask((sel) => (sel && sel.id === id ? { ...sel, completed: !sel.completed } : sel))
  }, [])

  /** Elimina una tarea. */
  const deleteTask = useCallback((id: string) => {
    /* `.filter()` devuelve un array nuevo SOLO con los elementos que cumplen
       la condición. Acá: "quedate con todos los que NO tengan este id".
       Es la forma inmutable de borrar — nada de `splice`. */
    setTasks((prev) => prev.filter((t) => t.id !== id))

    // Se borra desde el detalle, así que volvemos a la lista: la pantalla de
    // detalle de una tarea que ya no existe no tendría sentido.
    setSelectedTask(null)
  }, [])

  /** Abre el detalle de una tarea. */
  const openDetail = useCallback((task: Task) => setSelectedTask(task), [])

  /** Vuelve de la pantalla de detalle a la lista. */
  const closeDetail = useCallback(() => setSelectedTask(null), [])

  /* ═══ LA INTERFAZ ═════════════════════════════════════════════════════════ */
  return (
    /* ─── SafeAreaProvider ────────────────────────────────────────────────────
       Mide las zonas "no seguras" de la pantalla (notch, barra de estado, barra
       de gestos) y las pone a disposición de toda la app.

       Va lo más arriba posible, envolviendo todo. Es lo que hace funcionar
       tanto al <SafeAreaView> de abajo como al `useSafeAreaInsets()` que usa
       TaskForm. Sin este proveedor, ese hook devuelve 0 en todos los bordes. */
    <SafeAreaProvider>
      {/* `edges` elige QUÉ bordes respetar. Acá arriba y abajo: los laterales
          no hacen falta en orientación vertical y comerían ancho útil. */}
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Controla la barra de estado del sistema (reloj, batería, señal).
            `style="dark"` = íconos oscuros, porque nuestro fondo es claro.
            Si lo dejaras en claro sobre fondo claro, no se vería la hora. */}
        <StatusBar style="dark" />

        {/* Evita que el teclado tape el contenido (ver la explicación completa
            en TaskForm.tsx). Este cubre la pantalla principal; el formulario
            tiene el suyo propio porque vive dentro de un Modal. */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.screen}>
            {/* Encabezado de marca: siempre visible, en las dos vistas. */}
            <View>
              <Text style={styles.brand}>TaskFlow</Text>
              <Text style={styles.subtitle}>Listas, formulario y detalle</Text>
            </View>

            {/* ═══ LA "NAVEGACIÓN" ═════════════════════════════════════════════
                Un ternario decide qué pantalla se muestra. Leelo así:

                  ¿selectedTask tiene algo?
                    SÍ → el detalle
                    NO → la lista + tabs + formulario

                Todo el enrutado de la app son estas dos ramas. */}
            {selectedTask ? (
              /* ─── VISTA DETALLE ─────────────────────────────────────────── */
              <View style={styles.screen}>
                <TaskDetailScreen
                  /* Dentro de este `if`, TypeScript ya sabe que `selectedTask`
                     no es null (lo dedujo de la condición del ternario), así
                     que nos deja pasarla donde se espera un `Task`. Se llama
                     "narrowing" y es una de las mejores cosas de TypeScript. */
                  task={selectedTask}
                  onBack={closeDetail}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              </View>
            ) : (
              /* ─── VISTA LISTA ───────────────────────────────────────────── */
              <View style={styles.screen}>
                {/* Segundo ternario, anidado: qué pestaña mostrar.
                    Las dos pantallas reciben LAS MISMAS props y muestran LOS
                    MISMOS datos. Lo único que cambia es cómo los renderizan
                    (FlatList vs ScrollView + map), que es justamente lo que
                    queremos comparar. */}
                {activeTab === 'flatlist' ? (
                  <FlatListScreen tasks={tasks} onToggle={toggleTask} onSelect={openDetail} />
                ) : (
                  <ScrollViewScreen tasks={tasks} onToggle={toggleTask} onSelect={openDetail} />
                )}

                {/* La barra de pestañas: le pasamos cuál está activa y le
                    damos directamente `setActiveTab` como callback. Podemos
                    hacerlo porque su firma coincide exactamente con lo que
                    `onChange` espera: `(tab: TabKey) => void`. */}
                <TabBar active={activeTab} onChange={setActiveTab} />

                {/* El formulario: botón siempre visible + modal.
                    Está DENTRO de esta rama a propósito — en la pantalla de
                    detalle no queremos ofrecer "Nueva tarea".

                    Notá que solo le pasamos `onAdd`: TaskForm no necesita saber
                    nada de la lista, ni cuántas tareas hay, ni cuál está
                    seleccionada. Cuanto menos sabe un componente, más fácil es
                    reutilizarlo y menos motivos tiene para re-renderizarse. */}
                <TaskForm onAdd={addTask} />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safe: {
    /* Esta cadena de `flex: 1` desde la raíz hasta la lista es lo que hace que
       la FlatList tenga altura y pueda scrollear. Si cortás el `flex: 1` en
       cualquier eslabón, la lista desaparece sin dar error. */
    flex: 1,
    backgroundColor: colors.canvas
  },
  screen: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    /* `letterSpacing` negativo junta un poco las letras. En títulos grandes y
       en negrita, el espaciado por defecto se ve suelto; apretarlo apenas los
       hace ver más sólidos. Es un recurso tipográfico, no un capricho: usalo
       solo en textos grandes, nunca en texto de lectura. */
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs
  }
})
