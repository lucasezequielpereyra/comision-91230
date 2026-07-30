import type { Task } from '../types'

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Comprar pollo',
    description: 'Ir a la polleria a comprar 2kg de pechuga de pollo',
    time: 'month',
    category: 'Personal',
    done: false
  },
  {
    id: '2',
    title: 'Comprar pan',
    description: 'Ir a la panaderia a comprar 1kg de pan',
    time: 'today',
    category: 'Personal',
    done: true
  },
  {
    id: '3',
    title: 'Comprar leche',
    description: 'Ir al supermercado a comprar 2 litros de leche',
    time: 'tomorrow',
    category: 'Personal',
    done: false
  },
  {
    id: '4',
    title: 'Comprar huevos',
    description: 'Ir al supermercado a comprar 12 huevos',
    time: 'week',
    category: 'Personal',
    done: false
  }
]

export const name = 'Lucas Pereyra'
