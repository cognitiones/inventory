import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AddPermissionDto, GetPermissionAllDto, GetPermissionDto } from "./dto/permission.dto";

@Injectable()
export class PermissionService {
    @Inject(PrismaService)
    private prisma: PrismaService

    async addPermission(data: AddPermissionDto) {
        return await this.prisma.permission.create({
            data,
            select: {
                id: true
            }
        })
    }

    async getPermission(data: GetPermissionDto) {
        return await this.prisma.permission.findFirst({
            where: {
                id: data.permissionId
            }
        })
    }

    async getPermissionAll(data: GetPermissionAllDto) {
        return await this.prisma.permission.findMany({
            skip: (data.page - 1) * data.pageSize,
            take: data.pageSize
        })
    }
}
