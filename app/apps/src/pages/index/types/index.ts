import { TaskItem } from "@/service/common";

export interface TodayItem {
    listId: number,
    title: string,
    data: TaskItem[]
}

export {
    TaskItem
}