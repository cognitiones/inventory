import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddTaskDto,
  DeleteTaskDto,
  GetAllDto,
  GetTaskAndTagDto,
  CompleteTaskDto,
  GetUserTasksForMonthDto,
} from './dto/task.dto';
import { HttpService } from '@nestjs/axios';
import { ListService } from 'src/list/list.service';
// import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, generate } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addWeeks,
  isBefore,
  isSameMonth,
  addDays,
  addMonths,
  isSameDay,
  isAfter,
} from 'date-fns';
import { TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';

interface ExtendedTask extends Task {
  list?: {
    user?: {
      platformInfo: {
        app: {
          clientId: any;
        };
      };
    };
  };
}

interface RepeatStrategy {
  generateDates(task: Task, startDate: Date, endDate: Date): Task[];
}

abstract class BaseRepeatStrategy implements RepeatStrategy {
  abstract addInterval(date: Date, interval: number): Date;

  generateDates(task: Task, startDate: Date, endDate: Date): Task[] {
    const tasks: Task[] = [];
    let date = task.dueDate;
    let reminderDate = task.reminderDate;

    while (isBefore(date, endDate) || isSameMonth(date, endDate)) {
      if (isBefore(startDate, date) || isSameMonth(startDate, date)) {
        tasks.push({ ...task, dueDate: date, reminderDate: reminderDate });
      }
      date = this.addInterval(date, 1);
      reminderDate = this.addInterval(reminderDate, 1);
    }
    return tasks;
  }
}

class DailyRepeatStrategy extends BaseRepeatStrategy {
  addInterval(date: Date, interval: number): Date {
    return addDays(date, interval);
  }
}

class WeeklyRepeatStrategy extends BaseRepeatStrategy {
  addInterval(date: Date, interval: number): Date {
    return addWeeks(date, interval);
  }
}

class MonthlyRepeatStrategy extends BaseRepeatStrategy {
  addInterval(date: Date, interval: number): Date {
    return addMonths(date, interval);
  }
}

class NoneRepeatStrategy implements RepeatStrategy {
  generateDates(task: Task, startDate: Date, endDate: Date): Task[] {
    if (isBefore(task.dueDate, endDate) || isSameMonth(task.dueDate, endDate)) {
      return [task];
    }
    return [];
  }
}

@Injectable()
export class TaskService {
  @Inject(ListService)
  private readonly listService: ListService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(PrismaService)
  private prisma: PrismaService;

  @Cron(CronExpression.EVERY_MINUTE)
  async getPushTasks() {
    const now = new Date();
    const tasks = await this.prisma.task.findMany({
      where: {
        reminderDate: {
          lte: now,
        },
        completed: false,
        isReminded: false,
      },
      include: {
        list: {
          select: {
            user: {
              select: {
                platformInfo: {
                  select: {
                    app: {
                      select: {
                        clientId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    for (const task of tasks) {
      await this.pushTask(task);
      // this.logger.debug(`Task with id ${task.id} is due and notification has been sent.`);
    }
  }

  async pushTask(task: ExtendedTask) {
    // return
    const clientid = task?.list?.user?.platformInfo?.app?.clientId;
    const title = task.title;
    const content = task.description;

    if (!clientid) {
      return '无设备id';
    }
    // return
    const uniCloud_url = this.configService.get('uniCloud_url');

    let msg = {
      clientid: [clientid],
      title: title,
      content: content || title,
      // "payload": {
      //     "text": "第一条 payload - text"
      // }
    };
    console.log(msg.clientid, '1');
    function toQueryString(data) {
      return '?' + new URLSearchParams(data).toString();
    }
    let pushData = toQueryString(msg);
    console.log(pushData, 'pushMsg');

    const { data } = await firstValueFrom(
      this.httpService.get(`${uniCloud_url}/uniPush` + pushData).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    console.log(data, 'data');

    if (data.errCode == 0) {
      await this.prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          isReminded: true,
        },
      });
      console.log('推送成功');
    }

    return;
  }

  //完成任务
  async completeTask(data: CompleteTaskDto) {
    return this.prisma.task.update({
      where: {
        id: data.taskId,
      },
      data: {
        completed: data.completed,
      },
      select: {
        id: true,
      },
    });
  }

  async getUserTasksForMonth(userId: number, data: GetUserTasksForMonthDto) {
    let startDate, endDate;
    if (data.month && data.year) {
      const currentDate = new Date(data.year, data.month - 1, 1);
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
    } else {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }

    //获取这个月份

    //获取这个月份的所有任务
    const tasks = await this.prisma.task.findMany({
      where: {
        list: {
          userId: userId,
        },
        OR: [
          {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            repeat: {
              in: ['DAILY', 'WEEKLY', 'MONTHLY'],
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const allTasks = [];
    const repeatStrategies = {
      DAILY: new DailyRepeatStrategy(),
      WEEKLY: new WeeklyRepeatStrategy(),
      MONTHLY: new MonthlyRepeatStrategy(),
      NONE: new NoneRepeatStrategy(),
    };

    tasks.forEach((task) => {
      const strategy = repeatStrategies[task.repeat] || repeatStrategies.NONE;
      const generatedTasks = strategy.generateDates(task, startDate, endDate);
      allTasks.push(...generatedTasks);
    });

    // 按天排列任务
    const tasksByDay = Object.values(
      allTasks.reduce((acc, task) => {
        const day = task.dueDate.getDate();
        let month = task.dueDate.getMonth() + 1;
        const year = task.dueDate.getFullYear();
        const time = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        if (!acc[time]) {
          acc[time] = { date: time, data: [] };
        }
        acc[time].data.push(task);
        return acc;
      }, {}),
    );

    return tasksByDay;
  }

  async getUserTasksForToday(userId: number) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const tasks = await this.prisma.task.findMany({
      where: {
        list: {
          userId: userId,
        },
        OR: [
          {
            dueDate: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
          {
            dueDate: null,
          },
        ],
        repeat: {
          in: ['DAILY', 'WEEKLY', 'MONTHLY', 'NONE']
        }
      },
      include: {
        list: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const repeatStrategies = {
      NONE: (task: Task) => isSameDay(task.dueDate, new Date()),
      DAILY: (task: Task)=> isAfter(new Date(), task.dueDate) || isSameDay(new Date(), task.dueDate),
      WEEKLY: (task: Task) => {
        let nextDueDate = task.dueDate
        while(isBefore(startOfDay(nextDueDate), startOfDay(new Date()))){
          nextDueDate = addWeeks(nextDueDate, 1)
        }

        return isSameDay(nextDueDate, new Date())
      },
      MONTHLY: (task: Task)=>{
        let nextDueDate = task.dueDate
        while(isBefore(startOfDay(nextDueDate), startOfDay(new Date()))){
          nextDueDate = addMonths(nextDueDate, 1)
        }

        return isSameDay(nextDueDate, new Date())
      }
    }

    const filteredTasks = tasks.filter((task)=>{
      const strategy = repeatStrategies[task.repeat]
      return strategy ? strategy(task) : false
    })

    const result = [];

    filteredTasks.forEach((el) => {
      result.push({
        ...el,
        tags: el.tags.map((tags) => tags.tag),
      });
    });

    return result;
  }

  async addTask(userId: number, data: AddTaskDto) {
    let { listId, tagName, ...taskData } = data;

    if (!listId) {
      listId = (await this.listService.getFirstList(userId)).id;
    }

    let task: Prisma.TaskCreateInput = null;
    if (tagName) {
      task = {
        ...taskData,
        list: {
          connect: { id: listId },
        },
        tags: {
          create: {
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          },
        },
      };
    } else {
      task = {
        ...taskData,
        list: {
          connect: { id: listId },
        },
      };
    }

    return (await this.prisma.task.create({ data: task, select: { id: true } }))
      .id;
  }

  async getTaskAndTag(data: GetTaskAndTagDto) {
    let taskWithTags = await this.prisma.task.findUnique({
      where: {
        id: data.taskId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    let result = {
      ...taskWithTags,
      tags: taskWithTags.tags.map((tag) => tag.tag),
    };

    return result;
  }

  async getAll(data: GetAllDto) {
    return await this.prisma.task.findMany({
      where: {
        listId: data.listId,
      },
      skip: (data.page - 1) * data.pageSize,
      take: data.pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteTask(data: DeleteTaskDto) {
    // 使用 Prisma 事务
    return await this.prisma.$transaction(async (prisma) => {
      // 首先删除 TaskTags 中的相关记录
      await prisma.taskTags.deleteMany({
        where: {
          taskId: data.taskId,
        },
      });

      // 然后删除 Task
      return await prisma.task.delete({
        where: {
          id: data.taskId,
        },
        select: {
          id: true,
        },
      });
    });
  }
}
