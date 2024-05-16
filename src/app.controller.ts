import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { MessageQueueService } from './message-queue/message-queue.service';
import * as os from 'os';
import { UserRepository } from 'src/users/users.repository';
import LocalFilesInterceptor from './utils/services/upload-local';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private readonly messageQueueService: MessageQueueService,
    private readonly UserRepository: UserRepository
  ) { }

  @Public()
  @Get()
  async getHello() {
    // await this.wait(10000)
    // let test = await this.UserRepository.findOne({})
    // console.log(test)
    return { host: os.hostname(), wow: 'successfully LoOoTaA' };
  }

  wait(ms) {
    let start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  @Public()
  @Get('health')
  health() {
    return { healthStatus: 'OK' };
  }


  @Public()
  @Post('upload-local')
  @UseInterceptors(LocalFilesInterceptor({
    fieldName: 'file',
    path: '/avatars',
    fileFilter: (request, file, callback) => {
      if (!file.mimetype.includes('image')) {
        return callback(new BadRequestException('Provide a valid image'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: Math.pow(1024, 2) // 1MB
    }
  }))
  uploadLocal(@UploadedFile() file: Express.Multer.File) {
    return file
  }

  // @Public()
  // @Get('publisher')
  // async publish() {
  //   await this.messageQueueService.publishToChannel({
  //     routingKey: 'test1',
  //     exchangeName: '',
  //     data: 'q',
  //   });
  //   return 'OK';
  // }
}
