import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { FormatResponseInterceptor } from "./format-response.interceptor";
import { CustomExceptionFilter } from "./custom-exception.filter";
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //设置参数检验 + 参数类型转换
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))

  //设置统一成功响应
  app.useGlobalInterceptors(new FormatResponseInterceptor())

  //设置统一失败响应
  app.useGlobalFilters(new CustomExceptionFilter())

  //设置接口文档
  const config = new DocumentBuilder()
    .setTitle("个人清单")
    .setDescription('api 接口文档')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证'
    })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-doc', app, document)

  app.enableCors()

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
