import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AddTaskDto, GetAllDto, GetTaskAndTagDto, GetUserTasksForTodayDto, CompleteTaskDto } from "./dto/task.dto";
import { Cron } from '@nestjs/schedule';
import { startOfDay, endOfDay } from 'date-fns';
@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    @Inject(PrismaService)
    private prisma: PrismaService

    // @Cron('* * * * * *')
    // handleCron(){
    //     this.logger.debug("Called when the current second is 45")
    // }

    //完成任务
    async completeTask(data: CompleteTaskDto) {
        return this.prisma.task.update({
            where: {
                id: data.taskId
            },
            data: {
                completed: data.completed,
            },
            select: {
                id: true,
            }
        })
    }

    async getUserTasksForToday(data: GetUserTasksForTodayDto) {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const tasks = await this.prisma.task.findMany({
            where: {
                list: {
                    userId: data.userId,
                },
                OR: [
                    {
                        dueDate: {
                            gte: todayStart,
                            lte: todayEnd,
                        },
                    },
                    {
                        dueDate: null
                    }
                ]

            },
            include: {
                list: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const result = []
        tasks.forEach((el) => {
            result.push({
                ...el,
                tags: el.tags.map(tags => tags.tag)
            })
        })

        return result;
    }

    async addTask(data: AddTaskDto) {
        const { listId, tagName, ...taskData } = data;
        let task: Prisma.TaskCreateInput = null
        if (tagName) {
            task = {
                ...taskData,
                list: {
                    connect: { id: listId }
                },
                tags: {
                    create: {
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName }
                            }
                        }
                    }
                }
            }
        } else {
            task = {
                ...taskData,
                list: {
                    connect: { id: listId },
                }
            }
        }

        return (await this.prisma.task.create({ data: task, select: { id: true } })).id
    }

    async getTaskAndTag(data: GetTaskAndTagDto) {
        let taskWithTags = await this.prisma.task.findUnique({
            where: {
                id: data.taskId
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
        });

        let result = {
            ...taskWithTags,
            tags: taskWithTags.tags.map(tag => tag.tag)
        }

        return result
    }

    async getAll(data: GetAllDto) {
        return await this.prisma.task.findMany({
            where: {
                listId: data.listId
            },
            skip: (data.page - 1) * data.pageSize,
            take: data.pageSize,
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
}
