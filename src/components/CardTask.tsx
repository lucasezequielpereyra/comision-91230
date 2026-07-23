import { View, Text, StyleSheet } from 'react-native'
import type { Task } from '../types'
import { colors, shadows } from '../theme/'

type CardTask = {
  task: Task
}

const CardTask = ({ task }: CardTask) => {
  const taskSpanish: Record<Task['time'], string> = {
    today: 'Hoy',
    tomorrow: 'Mañana',
    week: 'Semana',
    month: 'Mes'
  }

  return (
    <View style={styles.cardTask} key={task.id}>
      <View style={styles.headerTask}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
        <Text style={{ fontSize: 16 }}>{task.description}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: task.done ? 'green' : 'red' }}>
          {task.done ? 'Resuelta' : 'No Resuelta'}
        </Text>
        <Text style={{ fontSize: 16 }}>{taskSpanish[task.time]}</Text>
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
