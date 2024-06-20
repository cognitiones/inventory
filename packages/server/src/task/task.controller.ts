import { Body, Controller, Get, Post, Query, SetMetadata } from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto, GetAllDto, GetTaskAndTagDto, GetUserTasksForTodayDto, CompleteTaskDto, DeleteTaskDto, GetUserTasksForMonthDto } from "./dto/task.dto";
import { ApiTags, ApiBody, ApiQuery, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("任务模块")
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post('/addTask')
  async addTask(@Body() data: AddTaskDto) {
    return await this.taskService.addTask(data)
  }

  @ApiBearerAuth()
  @Get('/getAll')
  @SetMetadata('require-login', true)
  async getAll(@Query() data: GetAllDto) {
    return await this.taskService.getAll(data)
  }

  @Get('/getTaskAndTag')
  async getTaskAndTag(@Query() data: GetTaskAndTagDto) {
    return await this.taskService.getTaskAndTag(data)
  }

  @Get('/getUserTasksForToday')
  async getUserTasksForToday(@Query() data: GetUserTasksForTodayDto) {
    return await this.taskService.getUserTasksForToday(data)
  }

  @Post('/completeTask')
  async completeTask(@Body() data: CompleteTaskDto) {
    return await this.taskService.completeTask(data)
  }

  @Post('/deleteTask')
  async deleteTask(@Body() data: DeleteTaskDto) {
    return await this.taskService.deleteTask(data)
  }

  @Get('/getUserTasksForMonth')
  async getUserTasksForMonth(@Query() data: GetUserTasksForMonthDto) {
    return await this.taskService.getUserTasksForMonth(data) 
  }

  // @Get('/pushTask')
  // async pushTask(){
  //   return await this.taskService.pushTask()
  // }
}
