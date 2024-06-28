import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
// import { UserModule } from "src/user/user.module";
import { ListModule } from 'src/list/list.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ListModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
