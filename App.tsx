import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeScreen from './src/screens/HomeScreen'
import { colors } from './src/theme/colors'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgounrdColor,
    alignItems: 'center',
    padding: 16,
    gap: 24
  }
})
