export type Task = {
  id: string
  title: string
  done: boolean
  description: string
  time: 'today' | 'tomorrow' | 'week' | 'month'
}
