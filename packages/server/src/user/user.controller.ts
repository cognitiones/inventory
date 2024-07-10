import { Controller, Get, Post, Body, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserDto,
  GetUserAllDto,
  LoginDto,
  GetUserPermissionsDto,
  UpdateUserDto,
  GetUserDto,
  RefreshTokenDto
} from './dto/user.dto';
import { getAllVo, RegisterUserVo } from './vo/user.vo';
import { RequireLogin, SystemInfo } from 'src/custom.decorator';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '用户注册', description: '注册一个新用户' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ type: RegisterUserVo })
  @Post('/register')
  async register(
    @SystemInfo('platform') platform: string,
    @Body() registerUser: RegisterUserDto,
  ) {
    return await this.userService.addUser(platform, registerUser);
  }

  @Post('/login')
  async login(@Body() data: LoginDto) {
    return await this.userService.login(data);
  }

  @Post('/refreshToken')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return await this.userService.refreshToken(data.refreshToken);
  }

  @ApiResponse({ status: 200, type: getAllVo })
  @Get('/getAll')
  async getAll(@Query() data: GetUserAllDto) {
    return await this.userService.getAll(data);
  }

  @Get('/getUser')
  async getUser(@Query() data: GetUserDto) {
    return await this.userService.getUser(data);
  }

  @Get('/getUserPermissions')
  async getUserPermissions(@Query() data: GetUserPermissionsDto) {
    return await this.userService.getUserPermissions(data);
  }

  @Post('/updateUser')
  @RequireLogin()
  async updateUser(
    @SystemInfo('platform') platform: string,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateUser(platform, data);
  }
}
