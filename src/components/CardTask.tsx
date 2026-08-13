import { View, Text, StyleSheet } from 'react-native'
import type { Task } from '../types'
import { colors, shadows } from '../theme/'

type CardTask = {
  task: Task
}

const CardTask = ({ task }: CardTask) => {
  const taskSpanish: Record<Task['date'], string> = {
    today: 'Hoy',
    tomorrow: 'Mañana',
    nextWeek: 'Próxima semana'
  }

  return (
    <View style={styles.cardTask}>
      <View style={styles.headerTask}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
        <Text style={{ fontSize: 16 }}>{task.description}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: task.completed ? 'green' : 'red' }}>
          {task.completed ? 'Resuelta' : 'No Resuelta'}
        </Text>
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