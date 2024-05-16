import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import * as path from 'path'
import { ConfigService } from '@nestjs/config';

@ApiTags('upload-files')
@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService, private readonly configService: ConfigService) { }

  @Public()
  @Post()
  uploadFilesToDO() {
    const filePath = __dirname.replace('dist', 'src') + '/remah.png';
    const folderName = 'HSE'
    const bucketName = this.configService.get('DO_SPACE_BUCKET_NAME');
    const fileName = Date.now() + path.extname(filePath);
    return this.uploadFilesService.uploadFilesToDO(filePath, bucketName, folderName, fileName);
  }

}
