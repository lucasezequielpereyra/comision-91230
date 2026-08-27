import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../../config/firebase'
import type { Task } from '../../types'

export type NewTaskData = Omit<Task, 'id'>

export const createTask = async (
  task: NewTaskData,
  userId: string
) => {
  await addDoc(collection(db, 'tasks'), {
    ...task,
    userId,
    createdAt: serverTimestamp(),
  })
}

export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  const tasksQuery = query(
    collection(db, 'tasks'),
    where('userId', '==', userId)
  )

  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((document) => {
      const data = document.data()

      return {
        id: document.id,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        completed: data.completed,
      }
    })

    callback(tasks)
  })
}

export const updateTaskStatus = async (
  taskId: string,
  completed: boolean
) => {
  const taskRef = doc(db, 'tasks', taskId)

  await updateDoc(taskRef, {
    completed,
  })
}

export const removeTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId)

  await deleteDoc(taskRef)
}