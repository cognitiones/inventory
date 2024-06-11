import { Inject, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';


@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }
    const permissions = request.user.permissions;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
      context.getClass(),
      context.getHandler()
    ])

    if (!requiredPermissions) {
      return true;
    }
    console.log(requiredPermissions);
    console.log(permissions);

    const module = requiredPermissions[0]
    const action = requiredPermissions[1]

    const found = permissions.some(permission => {
      if (permission.module === module && permission.name === action) {
        return true
      }
    })

    if (!found) {
      throw new UnauthorizedException('无权限访问')
    }

    return true;
  }
}
