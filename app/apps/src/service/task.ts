import { http } from '@/utils/http'

import { TaskItem } from './common'

export interface MonthTask {
  date: string
  data: TaskItem[]
}

export interface CompleteTaskDto {
  taskId: number
  completed: boolean
}

export interface DeleteTaskDto {
  taskId: number
}

export interface AddTaskDto {
  tagName?: string
  // listId: number
  title: string
  description?: string
  completed: boolean
  reminderDate?: string
  dueDate?: string
  repeat: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE'
}

export interface GetUserTasksForMonthDto {
  month?: number
}

export const getUserTasksForToday = () => {
  return http.get<TaskItem[]>('/task/getUserTasksForToday')
}

export const completeTask = (data: CompleteTaskDto) => {
  return http.post('/task/completeTask', data)
}

export const addTask = (data: AddTaskDto) => {
  return http.post('/task/addTask', data)
}

export const deleteTask = (data: DeleteTaskDto) => {
  return http.post('/task/deleteTask', data)
}

export const getUserTasksForMonth = (data: GetUserTasksForMonthDto) => {
  return http.get<MonthTask[]>('/task/getUserTasksForMonth', data)
}
