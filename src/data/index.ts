import type { Task } from '../types'

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Comprar pollo',
    description: 'Ir a la polleria a comprar 2kg de pechuga de pollo',
    category: 'hogar',
    date: 'nextWeek',
    completed: false
  },
  {
    id: '2',
    title: 'Comprar pan',
    description: 'Ir a la panaderia a comprar 1kg de pan',
    category: 'hogar',
    date: 'today',
    completed: true
  },
  {
    id: '3',
    title: 'Comprar leche',
    description: 'Ir al supermercado a comprar 2 litros de leche',
    category: 'hogar',
    date: 'tomorrow',
    completed: false
  },
  {
    id: '4',
    title: 'Comprar huevos',
    description: 'Ir al supermercado a comprar 12 huevos',
    category: 'hogar',
    date: 'nextWeek',
    completed: false
  }
]

export const name = 'Lucas Pereyra'