import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AddTaskDto, DeleteTaskDto, GetAllDto, GetTaskAndTagDto, GetUserTasksForTodayDto, CompleteTaskDto, GetUserTasksForMonthDto } from "./dto/task.dto";
import { Cron } from '@nestjs/schedule';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

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

    async getUserTasksForMonth(data: GetUserTasksForMonthDto) {
        let startDate, endDate
        if(data.month){
            const currentDate = new Date();
            currentDate.setMonth(data.month - 1); // 月份从0开始，1对应1月，2对应2月，以此类推
            currentDate.setDate(1); // 将日期设置为当月的第一天

            startDate = startOfMonth(currentDate);
            endDate = endOfMonth(currentDate);

            console.log(6, startDate,endDate);
        }else{
             startDate = startOfMonth(new Date());
             endDate = endOfMonth(new Date());
        }

        //获取这个月份 
      
        
        //获取这个月份的所有任务
        const tasks = await this.prisma.task.findMany({
            where: {
                list: {
                    userId: data.userId,
                },
                dueDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        // 按天排列任务
        const tasksByDay = Object.values(tasks.reduce((acc, task) => {
            const day = task.dueDate.getDate();
            let month = task.dueDate.getMonth() + 1;
            const year = task.dueDate.getFullYear();
            const time = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`

            if (!acc[time]) {
                acc[time] = { date: time, data: [] };
            }
            acc[time].data.push(task);
            return acc;
        }, {}));

        return tasksByDay;
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
        let { listId, tagName, ...taskData } = data;

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

    async deleteTask(data: DeleteTaskDto) {
        // 使用 Prisma 事务
        return await this.prisma.$transaction(async (prisma) => {
            // 首先删除 TaskTags 中的相关记录
            await prisma.taskTags.deleteMany({
                where: {
                    taskId: data.taskId
                }
            });

            // 然后删除 Task
            return await prisma.task.delete({
                where: {
                    id: data.taskId
                },
                select: {
                    id: true
                }
            });
        });
    }
}
