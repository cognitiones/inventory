import { Controller, Get, Post, Body, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, GetUserAllDto, LoginDto, GetUserPermissionsDto, UpdateUserDto } from "./dto/user.dto";
import { getAllVo, RegisterUserVo } from "./vo/user.vo";
import { ApiTags, ApiBody, ApiQuery, ApiResponse, ApiOperation} from "@nestjs/swagger";

@ApiTags("用户模块")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: '用户注册', description: '注册一个新用户' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ type: RegisterUserVo })
  @Post('/register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.addUser(registerUser)
  }

  @Post('/login')
  async login(@Body() data: LoginDto){
    return await this.userService.login(data)
  }

  @ApiResponse({ status: 200, type: getAllVo })
  @Get('/getAll')
  async getAll(data: GetUserAllDto) {
    return await this.userService.getAll(data)
  }

  @Get('/getUserPermissions')
  async getUserPermissions(@Query() data: GetUserPermissionsDto){
    return await this.userService.getUserPermissions(data)
  }

  @Post('/updateUser')
  async updateUser(@Body() data: UpdateUserDto){
    return await this.userService.updateUser(data)
  }
}
