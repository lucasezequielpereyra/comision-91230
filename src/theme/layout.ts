import { StyleSheet } from 'react-native'
import { colors} from './colors'
import { spacing } from './spacing'

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.canvas,
  },
})