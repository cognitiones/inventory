import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
const whitelist = ['/minio/uploadFile'];
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestUrl = context.switchToHttp().getRequest().url;
    const response = context.switchToHttp().getResponse<Response>();
    if (response.statusCode === 201) response.statusCode = 200;

    if (whitelist.includes(requestUrl)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: 'success',
          data,
        };
      }),
    );
  }
}
