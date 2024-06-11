import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { GetTasksDto } from "./dto/tag.dto";
import { GetTasksVo } from "./vo/tag.vo";

@ApiTags("标签模块")
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post('/addTag')
  async addTag(@Body() data: { name: string }) {
    return await this.tagService.addTag(data)
  }

  @ApiQuery({ type: GetTasksDto })
  @ApiResponse({ type: [GetTasksVo] })
  @Get('/getTasks')
  async getList(@Query() data: GetTasksDto) {
    return await this.tagService.getTasks(data)
  }
}
