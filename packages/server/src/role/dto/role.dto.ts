import { IsNumber, IsString, IsOptional, IsDateString, IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AddRoleDto {
    @IsString({ message: "name 不能为空" })
    name: string
}

export class GetRoleDto {
    @IsNumber({}, { message: "roleId 不能为空" })
    @Type(() => Number)
    roleId: number
}

export class GetRoleAllDto {
    @IsNumber({}, { message: "page 不能为空" })
    @Type(() => Number)
    page: number

    @IsNumber({}, { message: "pageSize 不能为空" })
    @Type(() => Number)
    pageSize: number
}

export class AssignRoleToUserDto {
    @IsNumber({}, { message: "roleId 不能为空" })
    @Type(() => Number)
    roleId: number

    @IsNumber({}, { message: "userId 不能为空" })
    @Type(() => Number)
    userId: number
}

export class AssignPermissionsToRoleDto {
    @IsArray({message: "permissions 不能为空 且为 整型数组"})
    permissions: number[]

    @IsNumber({}, {message: "roleId 不能为空 且为 整型"})
    roleId: number
}