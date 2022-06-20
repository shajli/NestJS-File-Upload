import {
  Controller,
  Get,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import {
  videoUploadCdn,
  videoFileName,
  videoFilter,
} from './helpers/upload.helpers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: videoUploadCdn,
        filename: videoFileName,
      }),
      fileFilter: videoFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    let response = null;
    if (file) {
      response = {
        fileName: file.filename,
        uri: file.path,
        message: 'File successfully uploaded',
      };
    } else {
      response = {
        statusCode: 400,
        message: "File isn't uploaded",
        error: "video formated mismatched"
      };
    }

    return response;
  }
}
