/* ════════════════════════════════════════════════════════════════════════════
 * src/components/CardTask.tsx · TARJETA DE TAREA (Clase 2)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * 📌 Este componente es de la CLASE 2. Su sucesor es `TaskItem.tsx`, que es el
 *    que usa la app hoy. Vale la pena abrir los dos y compararlos:
 *
 *    CardTask (Clase 2)                 TaskItem (Clase 4)
 *    ──────────────────                 ──────────────────
 *    Solo muestra                       Muestra Y responde a toques
 *    Sin props de callback              onToggle, onPress, onMountChange
 *    Sin memo()                         memo() para evitar re-renders
 *    Estilos inline mezclados           todo en el StyleSheet
 *
 *    La diferencia de fondo: `CardTask` es un cartel, `TaskItem` es un control.
 *    Ese salto —de mostrar datos a interactuar con ellos— es exactamente el
 *    tema del Módulo 4.
 *
 * ⚠️ Actualizado al modelo nuevo de `Task`: donde antes decía `done` y `time`,
 *    ahora dice `completed` y `date`. El código es el mismo de la Clase 2.
 * ════════════════════════════════════════════════════════════════════════════ */

import { View, Text, StyleSheet } from 'react-native'
import type { Task } from '../types'
import { colors, shadows } from '../theme/'

/* `import type { Task }` (con la palabra `type`) importa SOLO el tipo, y deja
 * constancia de que no hay nada de esto en el JavaScript final. Es opcional,
 * pero deja más clara la intención y ayuda al compilador. */

type CardTask = {
  task: Task
}

const CardTask = ({ task }: CardTask) => {
  /* Diccionario para traducir la clave técnica al español.
   *
   * `Record<Task['date'], string>` obliga a que estén TODAS las opciones de
   * `DueDate`: si te olvidás de una, TypeScript te avisa.
   *
   * 💡 Detalle a mejorar: este objeto se recrea en cada render, y además
   * duplica lo que ya está en `DUE_DATES` (src/types/index.ts). En `TaskItem`
   * lo resolvimos importando el diccionario en vez de reescribirlo. Lo dejamos
   * así para que se vea el "antes". */
  const taskSpanish: Record<Task['date'], string> = {
    today: 'Hoy',
    tomorrow: 'Mañana',
    nextWeek: 'Próxima semana'
  }

  return (
    /* ⚠️ Ojo con este `key={task.id}`: acá NO hace nada.
       La `key` va en el elemento que devuelve el `.map()` —o sea, en el
       `<CardTask>` que escribe `HomeScreen`—, no adentro del componente.
       Es un error muy común; lo dejamos visible a propósito para señalarlo. */
    <View style={styles.cardTask} key={task.id}>
      <View style={styles.headerTask}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
        <Text style={{ fontSize: 16 }}>{task.description}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        {/* Color condicional con un ternario: verde si está resuelta, rojo si no. */}
        <Text style={{ color: task.completed ? 'green' : 'red' }}>
          {task.completed ? 'Resuelta' : 'No Resuelta'}
        </Text>
        {/* Buscamos la traducción en el diccionario usando la clave de la tarea. */}
        <Text style={{ fontSize: 16 }}>{taskSpanish[task.date]}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardTask: {
    width: '100%',
    backgroundColor: colors.cardBackgroundColor,
    boxShadow: shadows.cardShadow,
    padding: 16
  },
  headerTask: {
    gap: 2
  }
})

export default CardTask
