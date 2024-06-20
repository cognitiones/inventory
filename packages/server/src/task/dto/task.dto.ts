import { IsNumber, IsString, IsOptional, IsDateString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class AddTaskDto {
    tagName?: string

    @Type(() => Number)
    listId?: number

    @IsNotEmpty({
        message: "标题 不能为空"
    })
    @IsString()
    title: string

    description?: string

    @IsNotEmpty({
        message: "完成状态 不能为空"
    })
    @IsBoolean()
    completed: boolean

    reminderDate?: string

    dueDate?: string

    @ApiProperty({
        description: "DAILY 每日重复 | WEEKLY 每周重复 | MONTHLY 每月重复 | NONE 不重复"
    })
    @IsNotEmpty({
        message: "重复状态 不能为空"
    })
    repeat: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE'
}

export class GetAllDto {
    @IsNotEmpty({
        message: "listId 不能为空"
    })
    @Type(() => Number)
    listId: number

    @IsNotEmpty({
        message: "page 不能为空"
    })
    @Type(() => Number)
    page: number

    @IsNotEmpty({
        message: "pageSize 不能为空"
    })
    @Type(() => Number)
    pageSize: number

}

export class GetTaskAndTagDto {
    @Type(() => Number)
    taskId: number
}

export class GetUserTasksForTodayDto {
    @IsNotEmpty({
        message: "userId 不能为空"
    })
    @Type(() => Number)
    userId: number
}

export class CompleteTaskDto {
    @IsNotEmpty({
        message: "taskId 不能为空"
    })
    @Type(() => Number)
    taskId: number

    @IsNotEmpty({
        message: "completed 不能为空"
    })
    completed: boolean
}

export class DeleteTaskDto {
    @IsNotEmpty({
        message: "taskId 不能为空"
    })
    @Type(() => Number)
    taskId: number
}

export class GetUserTasksForMonthDto {
    @IsNotEmpty({
        message: "userId 不能为空"
    })
    @Type(() => Number)
    userId: number

    @Type(() => Number)
    month?: number
}