import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetUserAllDto,
  LoginDto,
  GetUserPermissionsDto,
  UpdateUserDto,
  RegisterUserDto,
} from './dto/user.dto';
import { ListService } from 'src/list/list.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { md5 } from 'src/utils';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;
  @Inject(ConfigService)
  private configService: ConfigService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(ListService)
  private listService: ListService;

  async login(data: LoginDto) {
    const user = await this.getUser({ email: data.email });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    console.log(user, data.password);

    if (!(user.password === md5(data.password))) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const permissions = await this.getUserPermissions({ userId: user.id });

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        roles: user.roles,
        permissions: permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );

    const vo = {
      userInfo: user,
      accessToken,
      refreshToken,
    };

    return vo;
  }

  async getUser(data: { email?: string; userId?: number }) {
    // const where: any = {};
    // if (data.email) where.email = data.email;
    // if (data.userId) where.id = data.userId;
    // console.log(where, 'where');

    // return;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { id: data.userId }],
      },
      include: {
        lists: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    //omit user字段中的 password
    // user && delete user.password;

    if (!user) {
      return null;
    }
    return {
      ...user,
      roles: user.roles.map((roles) => roles.role),
    };
  }

  async addUser(platform: string, data: RegisterUserDto) {
    let option = {};
    let { app_clientId, ...userData } = data;
    if (
      platform === 'app' &&
      data.app_clientId &&
      data.app_clientId.length > 0
    ) {
      option = {
        platformInfo: {
          create: {
            app: {
              create: {
                clientId: app_clientId,
              },
            },
          },
        },
      };
    }

    return await this.prisma.user.create({
      data: {
        ...userData,
        password: md5(data.password),
        lists: {
          create: {
            title: '收集箱',
            description: '收集箱',
          },
        },
        ...option,
      },
      select: {
        id: true,
      },
    });
  }

  async getAll(data: GetUserAllDto) {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        name: true,
      },
      skip: (data.page - 1) * data.pageSize,
      take: data.pageSize,
    });
  }

  async getUserPermissions(data: GetUserPermissionsDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const permissions = user.roles.flatMap((role) =>
      role.role.permissions.map((permission) => permission.permission),
    );

    return permissions;
  }

  async updateUser(platform, data: UpdateUserDto) {
    const { id, app, ...userData } = data;
    if (platform === 'app') {
      let option = {};
      if (app && app.clientId) {
        option = {
          platformInfo: {
            update: {
              data: {
                app: {
                  update: {
                    data: {
                      clientId: app.clientId,
                    },
                  },
                },
              },
            },
          },
        };
      }
      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...userData,
          ...option
        },
        select: {
          id: true,
        },
      });
    }
  }

  //获取用户下第一条list
  async getUserFirstList(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        lists: {
          take: 1,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    return user.lists[0];
  }
}
