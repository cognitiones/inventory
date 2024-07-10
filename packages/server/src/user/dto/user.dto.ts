import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail({}, { message: '不是合法的邮箱格式' })
  email: string;

  @IsString({ message: '密码不能为空' })
  password: string;
}

export class RegisterUserDto {
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '用户名不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  password: string;

  app_clientId?: string[];
}

export class GetUserAllDto {
  @IsNotEmpty({
    message: 'page 不能为空',
  })
  @Type(() => Number)
  page: number;

  @IsNotEmpty({
    message: 'pageSize 不能为空',
  })
  @Type(() => Number)
  pageSize: number;
}

export class GetUserDto {
  email?: string;

  @Type(() => Number)
  userId?: number;
}

export class GetUserPermissionsDto {
  @IsNumber({}, { message: 'userId 不能为空' })
  @Type(() => Number)
  userId: number;
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class UpdateUserDto {
  @IsNumber({}, { message: 'userId 不能为空' })
  @Type(() => Number)
  id: number;

  name?: string;

  email?: string;

  password?: string;

  headPic?: string

  app: App
}

class App {
  clientId: string
}
