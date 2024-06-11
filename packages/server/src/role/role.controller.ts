import { Controller, Query, Get, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AddRoleDto, GetRoleAllDto, GetRoleDto, AssignRoleToUserDto, AssignPermissionsToRoleDto } from "./dto/role.dto";

@ApiTags("角色模块")
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post('/addRole')
  async addRole(@Body() data: AddRoleDto){
    return await this.roleService.addRole(data)
  }

  @Get('/getRole')
  async getRole(@Query() params: GetRoleDto) {
    return await this.roleService.getRole(params)
  }

  @Get('/getAll')
  async getAll(@Query() params: GetRoleAllDto){
    return await this.roleService.getAll(params)
  }

  @Post('/assignRoleToUser')
  async assignRoleToUser(@Body() data: AssignRoleToUserDto) {
    return await this.roleService.assignRoleToUser(data)
  }

  @Post('/assignPermissionsToRole')
  async assignPermissionsToRole(@Body() data: AssignPermissionsToRoleDto) {
    return await this.roleService.assignPermissionsToRole(data)
  }
}
