import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { GetTasksDto } from "./dto/tag.dto";
@Injectable()
export class TagService {
    @Inject(PrismaService)
    private prisma: PrismaService

    async addTag(data: Prisma.TagCreateInput) {
        return await this.prisma.tag.create({
            data: {
                name: data.name
            },
            select: {
                id: true
            }
        })
    }

    async getTasks(data: GetTasksDto) {
        const tag = await this.prisma.tag.findUnique({
            where: { id: data.tagId },
            include: { tasks: true }, // 包含与标签关联的任务
        });
        console.log(tag,11);
        if(!tag){
            return []
        }
        const taskIds = tag.tasks.map(taskTag => taskTag.taskId)
        const tasks = await this.prisma.task.findMany({
            where: { id: { in: taskIds } }
        })

        return tasks
    }
}
