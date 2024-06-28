import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  AddTaskDto,
  GetAllDto,
  GetTaskAndTagDto,
  CompleteTaskDto,
  DeleteTaskDto,
  GetUserTasksForMonthDto,
} from './dto/task.dto';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from 'src/custom.decorator';

@ApiTags('任务模块')
@Controller('task')
@RequireLogin()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/addTask')
  async addTask(@UserInfo('userId') userId: number, @Body() data: AddTaskDto) {
    return await this.taskService.addTask(userId, data);
  }

  @ApiBearerAuth()
  @Get('/getAll')
  @SetMetadata('require-login', true)
  async getAll(@Query() data: GetAllDto) {
    return await this.taskService.getAll(data);
  }

  @Get('/getTaskAndTag')
  async getTaskAndTag(@Query() data: GetTaskAndTagDto) {
    return await this.taskService.getTaskAndTag(data);
  }

  @Get('/getUserTasksForToday')
  async getUserTasksForToday(@UserInfo('userId') userId: number) {
    return await this.taskService.getUserTasksForToday(userId);
  }

  @Post('/completeTask')
  async completeTask(@Body() data: CompleteTaskDto) {
    return await this.taskService.completeTask(data);
  }

  @Post('/deleteTask')
  async deleteTask(@Body() data: DeleteTaskDto) {
    return await this.taskService.deleteTask(data);
  }

  @Get('/getUserTasksForMonth')
  async getUserTasksForMonth(
    @UserInfo('userId') userId: number,
    @Query() data: GetUserTasksForMonthDto,
  ) {
    return await this.taskService.getUserTasksForMonth(userId, data);
  }

  // @Get('/pushTask')
  // async pushTask(){
  //   return await this.taskService.pushTask()
  // }
}
