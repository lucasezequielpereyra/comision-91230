
import { View, Text, Image, StyleSheet } from 'react-native'

import avatar from '../assets/avatar.webp'
import { colors, shadows } from '../theme'

type HeaderProps = {
  name: string
  totalTasks: number
}

const Header = ({ name, totalTasks }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.avatarHeader}>
        <Image
          source={avatar}
          style={{ width: '100%', height: '100%', borderRadius: 20 }}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text style={styles.headerText}>{name}</Text>
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
    flexDirection: 'row', 
    gap: 16,
    padding: 16,
    alignItems: 'center'
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