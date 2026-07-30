import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import Header from '../components/Header'
import CardTask from '../components/CardTask'
import { name } from '../data'
import { colors, textSize } from '../theme'
import { useState } from 'react'
import type { Task } from '../types'

const categories = ['Trabajo', 'Estudio', 'Personal'] as const

const HomeScreen = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>(categories[0])

  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')

  const [titleFocused, setTitleFocused] = useState(false)
  const [descriptionFocused, setDescriptionFocused] = useState(false)

  const isButtonDisabled = title.trim().length < 3 // Validación para habilitar o deshabilitar el botón

  const [taskList, setTaskList] = useState<Task[]>([])

  const handleAddTask = () => {
    let valid = true

    setTitleError('')
    setDescriptionError('')

    if (title.trim().length < 5) {
      setTitleError('El título debe tener al menos 5 caracteres.')
      valid = false
    }

    if (description.trim().length < 10) {
      setDescriptionError('La descripción debe tener al menos 10 caracteres.')
      valid = false
    }

    if (!valid) return

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      category,
      done: false,
      time: 'today'
    }

    console.log(newTask)

    setTaskList((prev) => [newTask, ...prev])

    Alert.alert('Éxito', 'Tarea capturada localmente.')

    setTitle('')
    setDescription('')
    setCategory(categories[0])
  }

  return (
    <>
      {/* <View style={styles.gretting}>
        <Text style={styles.grettingText}>Hola, buenos noches {name.slice(0, 5)}</Text>
      </View> */}
      <Header name={name} totalTasks={taskList.length} />
      <View style={styles.form}>
        <Text style={styles.formTitle}>Crear nueva tarea</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
          autoCapitalize="sentences"
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          style={[
            styles.input,
            titleFocused && styles.inputFocused,
            titleError && styles.inputError //Cuando escriba menos de 5 caracteres
          ]}
        />

        {titleError ? <Text style={styles.error}>{titleError}</Text> : null /*operador ternario*/}

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          multiline
          autoCapitalize="sentences"
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
          style={[
            styles.input,
            styles.textArea,
            descriptionFocused && styles.inputFocused,
            descriptionError && styles.inputError
          ]}
        />

        {descriptionError ? (
          <Text style={styles.error}>{descriptionError}</Text>
        ) : null}

        <Text style={styles.categoryTitle}>Categoría</Text>

        <View style={styles.categories}>
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.categoryButton,
                category === item && styles.categoryButtonSelected
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextSelected
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          disabled={isButtonDisabled}
          onPress={handleAddTask}
          style={({ pressed }) => [
            styles.button,
            isButtonDisabled && styles.buttonDisabled,
            pressed && !isButtonDisabled && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Agregar tarea</Text>
        </Pressable>
      </View>

      {/* <View style={{ width: '100%', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: textSize.subtitle, fontWeight: 'bold' }}>
          Tareas completadas {tasks.filter((task) => task.done).length} / {tasks.length}
        </Text>
      </View>
      <View style={{ width: '100%', gap: 16 }}>
        {tasks.map((task) => {
          return <CardTask key={task.id} task={task} />
        })}
      </View> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: colors.backgroundColor
  },

  greeting: {
    width: '100%'
  },

  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text
  },

  form: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 12
  },

  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: colors.text
  },

  inputFocused: {
    borderColor: colors.primary
  },

  inputError: {
    borderColor: colors.danger
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },

  error: {
    color: colors.danger,
    marginTop: -6
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text
  },

  categories: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.category
  },

  categoryButtonSelected: {
    backgroundColor: colors.categorySelected,
    borderColor: colors.categorySelected
  },

  categoryText: {
    color: colors.primary,
    fontWeight: '600'
  },

  categoryTextSelected: {
    color: '#fff'
  },

  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonPressed: {
    opacity: 0.85
  },

  buttonDisabled: {
    backgroundColor: '#B8C0CC'
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },

  section: {
    width: '100%'
  },

  sectionTitle: {
    fontSize: textSize.subtitle,
    fontWeight: '700',
    color: colors.text
  },

  taskContainer: {
    gap: 16,
    paddingBottom: 30
  }
})

export default HomeScreen
