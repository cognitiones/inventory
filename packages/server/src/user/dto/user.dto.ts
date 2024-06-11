import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @IsEmail({},{message: "不是合法的邮箱格式"})
    email: string

    @IsString({message: "密码不能为空"})
    password: string
}

export class RegisterUserDto {
    @IsNotEmpty({
        message: "邮箱不能为空"
    })
    @IsEmail({}, {
        message: "不是合法的邮箱格式"
    })
    @ApiProperty()
    email: string

    @IsNotEmpty({
        message: "用户名不能为空"
    })
    @ApiProperty()
    name: string

    @IsNotEmpty({
        message: "密码不能为空"
    })
    @MinLength(6, {
        message: "密码不能少于 6 位"
    })
    @ApiProperty()
    password: string
}

export class GetUserAllDto {
    @ApiProperty()
    @IsNotEmpty({
        message: "page 不能为空"
    })
    @Type(() => Number)
    page: number

    @ApiProperty()
    @IsNotEmpty({
        message: "pageSize 不能为空"
    })
    @Type(() => Number)
    pageSize: number
}

export class GetUserPermissionsDto {
    @IsNumber({},{message: "userId 不能为空"})
    @Type(() => Number)
    userId: number
}