import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
