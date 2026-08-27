import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'

import { createAccount } from '../../services/auth/authService'

type Props = {
  navigation: any
}

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')

    if (!email.trim() || !password || !confirmPassword) {
      setError('Completá todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await createAccount(email.trim(), password)
    } catch (error) {
      console.error(error)
      setError('No se pudo crear la cuenta')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskFlow</Text>
      <Text style={styles.subtitle}>Crear cuenta</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.link}>
          ¿Ya tenés una cuenta? Ingresá
        </Text>
      </Pressable>
    </View>
  )
}

export default RegisterScreen

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