import {
  Controller,
  Inject,
  Get,
  Post,
  Query,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  @Get('presignedUrl')
  presignedPutObject(@Query('name') name: string) {
    return this.minioClient.presignedPutObject('inventory', name, 3600);
  }
  
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const fileName = file.originalname;
    const fileBuffer = file.buffer;

    if (!fileName) {
      throw new Error('File name is required');
    }
    console.log(fileName,'fileName');
    
    const bucketName = 'inventory';  // 您的存储桶名称
    const res = await this.minioClient.putObject(bucketName, fileName, fileBuffer);

    const url = 'http://192.168.1.102:9000/inventory/' + fileName
    return url
  }
}
