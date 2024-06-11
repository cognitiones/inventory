import { IsNumber, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddPermissionDto {
    @IsString({message: "name 不能为空 并且为字符串"})
    name: string
    @IsString({message: "module 不能为空 并且为字符串"})
    module: string
    description?: string
}

export class GetPermissionDto {
    @IsNumber({},{message: "permissionId 不能为空 并且为整型"})
    @Type(()=> Number)
    permissionId: number
}

export class GetPermissionAllDto {
    @IsNumber({},{message: "page 不能为空 并且为整型"})
    @Type(()=> Number)
    page: number

    @IsNumber({},{message: "pageSize 不能为空 并且为整型"})
    @Type(()=> Number)
    pageSize: number
}