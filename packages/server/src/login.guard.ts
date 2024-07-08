import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

interface Permission {
  id: number;
  name: string;
  module: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface JwtUserData {
  userId: number;
  email: string;
  roles: string[];
  permissions: Permission[];
}

interface SystemInfo {
  platform: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
    systemInfo: SystemInfo;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);
    const platform = request.headers['platform'] as string;

    if (!platform) {
      throw new UnauthorizedException('非法平台');
    }

    request.systemInfo = {
      platform
    }

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];

      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      };

      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
