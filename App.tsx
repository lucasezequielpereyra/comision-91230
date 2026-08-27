import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { store } from './src/store'
import RootNavigator from './src/navigation/RootNavigator'
import { StyleSheet } from 'react-native'

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <RootNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
})