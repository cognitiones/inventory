import { ApiProperty } from "@nestjs/swagger";

export class GetTasksVo {
    @ApiProperty()
    id: number

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description?: string

    @ApiProperty()
    completed: boolean

    @ApiProperty()
    dueDate?: string

    @ApiProperty()
    repeat: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE'

    @ApiProperty()
    listId: number
}