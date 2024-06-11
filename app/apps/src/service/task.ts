import { http } from '@/utils/http'

import { TaskItem } from "./common";

export interface GetUserTasksForTodayDto {
    userId: number
}

export interface CompleteTaskDto {
    taskId: number
    completed: boolean
}

export interface AddTaskDto {
    tagName?: string
    listId: number
    title: string
    description?: string
    completed: boolean
    dueDate?: string
    repeat: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE'
}

export const getUserTasksForToday = (data: GetUserTasksForTodayDto) => {
    return http.get<TaskItem[]>('/task/getUserTasksForToday', data)
}

export const completeTask = (data: CompleteTaskDto) => {
    return http.post<{ id: number }>('/task/completeTask', data)
}

export const addTask = (data: AddTaskDto) => {
    return http.post<{id: number}>('/task/addTask', data)
}