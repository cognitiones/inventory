import { createParamDecorator, SetMetadata, ExecutionContext  } from "@nestjs/common";
import { Request } from 'express';


export const RequireLogin = ()=> SetMetadata('require-login', true)

export const RequirePermission = (permissions: string[]) => SetMetadata('require-permission', permissions)

export const UserInfo = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const request: Request = ctx.switchToHttp().getRequest();
  
      if(!request.user) {
          return null;
      }
      return data ? request.user[data] : request.user;
    },
  )

  export const SystemInfo = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const request: Request = ctx.switchToHttp().getRequest();
  
      if(!request.systemInfo) {
          return null;
      }
      return data ? request.systemInfo[data] : request.systemInfo;
    },
  )