import type { Task } from '../types'

const raw: Array<[string, string, Task['category'], Task['date'], boolean]> = [
  ['Preparar la clase 4', 'Armar los ejemplos de FlatList y ScrollView', 'trabajo', 'today', false],
  ['Responder mails', 'Contestar las consultas de los estudiantes', 'trabajo', 'today', true],
  ['Corregir entregas', 'Revisar los proyectos del checkpoint 3', 'trabajo', 'tomorrow', false],
  ['Repasar useState', 'Volver a ver el ejemplo del contador', 'estudio', 'today', false],
  ['Leer sobre FlatList', 'Documentación oficial de React Native', 'estudio', 'tomorrow', false],
  ['Practicar TypeScript', 'Ejercicios de union types y Record', 'estudio', 'nextWeek', false],
  ['Comprar pan', 'Ir a la panadería a comprar 1kg de pan', 'hogar', 'today', true],
  ['Comprar leche', 'Dos litros en el supermercado', 'hogar', 'today', false],
  ['Comprar huevos', 'Una docena', 'hogar', 'tomorrow', false],
  ['Sacar la basura', 'Antes de las 21hs', 'hogar', 'today', false],
  ['Llamar a mamá', 'Preguntarle cómo salió el estudio', 'personal', 'today', false],
  ['Turno con el dentista', 'Pedirlo por la app de la obra social', 'personal', 'tomorrow', false],
  ['Ir al gimnasio', 'Rutina de piernas', 'personal', 'today', false],
  ['Renovar la SUBE', 'Cargarla antes del lunes', 'personal', 'nextWeek', false]
]

export const SEED_TASKS: Task[] = raw.map(([title, description, category, date, completed], i) => ({
  id: `seed-${i + 1}`,
  title,
  description,
  category,
  date,
  completed
}))