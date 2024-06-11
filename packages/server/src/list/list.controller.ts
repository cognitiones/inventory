import { Controller, Post, Get, Body, Query, SetMetadata } from '@nestjs/common';
import { ListService } from './list.service';
import { AddListDto, GetListDto, GetAllListDto } from "./dto/list.dto";
import { GetListVo, AddListVo } from "./vo/list.vo";
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { RequireLogin, RequirePermission } from "src/custom.decorator";

@ApiTags("清单模块")
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @ApiQuery({ type: GetListDto })
  @ApiResponse({ type: GetListVo })
  // @RequireLogin()
  // @RequirePermission(['list','getList'])
  @Get('/getList')
  async getList(@Query() data: GetListDto) {
    return await this.listService.getList(data.userId, data.listId)
  }

  @ApiQuery({ type: GetAllListDto })
  @ApiResponse({ type: [GetListVo] })
  @Get('/getAll')
  async getAll(@Query() data: GetAllListDto) {
    return await this.listService.getAllList(data)
  }

  // @ApiBody({ type: AddListDto })
  // @ApiResponse({ type: AddListVo })
  @Post('/addList')
  async addList(@Body() list: AddListDto) {
    return await this.listService.addList(list)
  }
}
