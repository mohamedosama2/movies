import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs'
@Injectable()
export class UploadFilesService {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('DO_SPACE_ACCESS_KEY'),
      secretAccessKey: this.configService.get('DO_SPACE_SECRET_KEY'),
      endpoint: this.configService.get('DO_SPACE_END_POINT'),
      signatureVersion: 'v4'
    }); 
  }

  async uploadFilesToDO(filePath: string, bucketName: string, folderName: string, fileName: string) {
    const file = fs.readFileSync(filePath);
    const data = await this.s3.putObject({ Bucket: bucketName + '/' + folderName, Key: fileName, ACL: "public-read", Body: file, }).promise()
    return `https://${bucketName}.fra1.digitaloceanspaces.com/${folderName}/${fileName}`
  }


}
