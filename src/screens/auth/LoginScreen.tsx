import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'

import { signIn } from '../../services/auth/authService'

type Props = {
  navigation: any
}

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!email.trim() || !password) {
      setError('Completá email y contraseña')
      return
    }

    try {
      await signIn(email.trim(), password)
    } catch (error) {
      console.error(error)
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskFlow</Text>
      <Text style={styles.subtitle}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.link}>
          ¿No tenés una cuenta? Registrate
        </Text>
      </Pressable>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  link: {
    textAlign: 'center',
  },

  error: {
    color: 'red',
    marginBottom: 8,
  },
})