import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AddRoleDto, GetRoleDto, GetRoleAllDto, AssignRoleToUserDto, AssignPermissionsToRoleDto } from "./dto/role.dto";
import { connect } from 'http2';

@Injectable()
export class RoleService {
    @Inject(PrismaService)
    private prisma: PrismaService

    async addRole(data: AddRoleDto) {
        return await this.prisma.role.create({ data: { name: data.name }, select: { id: true } })
    }

    async getRole(data: GetRoleDto) {
        const role = await this.prisma.role.findFirst({
            where: {
                id: data.roleId
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                },
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        })

        return {
            ...role,
            users: role.users.map(user => user.user),
            permissions: role.permissions.map(permission => permission.permission)
        }
    }

    async getAll(data: GetRoleAllDto) {
        return await this.prisma.role.findFirst({
            skip: (data.page - 1) * data.pageSize,
            take: data.pageSize
        })
    }

    async assignRoleToUser(data: AssignRoleToUserDto) {
        return await this.prisma.role.update({
            where: {
                id: data.roleId
            },
            data: {
                users: {
                    create: {
                        userId: data.userId
                    }
                }
            },
            select: {
                id: true
            }
        })
    }

    async assignPermissionsToRole(data: AssignPermissionsToRoleDto) {
        //判断是否有这些权限
        const permissions = await this.prisma.permission.findMany({
            where: {
                id: {
                    in: data.permissions
                }
            },
            select: {
                id: true
            }
        })

        if (permissions.length !== data.permissions.length) {
            throw new HttpException("权限不存在", HttpStatus.BAD_REQUEST)
        }

        //判断是否已经设置权限
        const hasPermissions = await this.prisma.rolePermission.findMany({
            where: {
                roleId: data.roleId,
                permissionId: {
                    in: data.permissions
                }
            }
        })
        
        if(hasPermissions.length === data.permissions.length){
            throw new HttpException("权限已存在", HttpStatus.BAD_REQUEST)
        }

        return await this.prisma.role.update({
            where: {
                id: data.roleId
            },
            data: {
                permissions: {
                    createMany: {
                        data: data.permissions.map(permissionId => ({
                            permissionId: permissionId
                        }))
                    }
                }
            }
        })
    }
}
