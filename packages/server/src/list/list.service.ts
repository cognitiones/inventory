import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AddListDto, GetAllListDto } from "./dto/list.dto";

@Injectable()
export class ListService {
    @Inject(PrismaService)
    private prisma: PrismaService

    async getList(userId: number, listId: number) {
        return await this.prisma.list.findFirst({
            where: {
                id: listId,
                userId: userId
            },
            include: {
                tasks: true
            }
        })
    }

    async addList(res: AddListDto) {
        const { userId, ...list } = res

        const data: Prisma.ListCreateInput = {
            ...list,
            user: {
                connect: { id: userId }
            },
        }

        return await this.prisma.list.create({ data, select: { id: true } })
    }

    async getAllList(data: GetAllListDto) {
        return this.prisma.list.findMany({
            where: {
                userId: data.userId
            },
            skip: (data.page - 1) * data.pageSize,
            take: data.pageSize,
            include: {
                tasks: true
            }
        })
    }

    //获取用户下的第一条清单
    async getFirstList(userId: number) {
        return await this.prisma.list.findFirst({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "asc"
            }
        })
    }
    
}
