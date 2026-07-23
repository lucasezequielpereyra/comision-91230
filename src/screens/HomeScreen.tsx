import { View, Text, StyleSheet } from 'react-native'
import Header from '../components/Header'
import CardTask from '../components/CardTask'
import { tasks, name } from '../data'
import { textSize } from '../theme'

const HomeScreen = () => {
  return (
    <>
      <View style={styles.gretting}>
        <Text style={styles.grettingText}>Hola, buenas noches {name.slice(0, 5)}</Text>
      </View>
      <Header name={name} totalTasks={tasks.length} />
      <View style={{ width: '100%', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: textSize.subtitle, fontWeight: 'bold' }}>
          Tareas completadas {tasks.filter((task) => task.done).length} / {tasks.length}
        </Text>
      </View>
      <View style={{ width: '100%', gap: 16 }}>
        {tasks.map((task) => {
          return <CardTask key={task.id} task={task} />
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  gretting: {
    width: '100%'
  },
  grettingText: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default HomeScreen
