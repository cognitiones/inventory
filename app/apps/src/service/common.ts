export interface ListItem {
    createdAt: string,
    description: string,
    endDate: string,
    id: 1,
    startDate: string,
    tasks?: TaskItem[],
    title: string,
    updatedAt: string,
    userId: number
}

export interface TaskItem {
    completed: boolean
    createdAt: string
    description: string
    dueDate: string
    id: number
    list?: ListItem
    listId?: number
    repeat: "NONE"
    tags?: TagItem[]
    title: string
    type: "INITIAL"
    updatedAt: string
}

export interface TagItem {
    createdAt: string
    id: number
    name: string
    updatedAt: string
}