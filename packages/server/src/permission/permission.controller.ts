import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { GetPermissionAllDto, GetPermissionDto, AddPermissionDto } from "./dto/permission.dto";

@ApiTags('权限模块')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/addPermission')
  async addPermission(@Body() data: AddPermissionDto){
    return await this.permissionService.addPermission(data)
  }

  @Get('/getPermission')
  async getPermission(@Query() params: GetPermissionDto){
    return await this.permissionService.getPermission(params)
  }

  @Get('/getPermissionAll')
  async getPermissionAll(@Query() params: GetPermissionAllDto){
    return await this.permissionService.getPermissionAll(params)
  }
}
