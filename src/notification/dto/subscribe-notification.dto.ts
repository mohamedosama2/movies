import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceType } from 'src/users/models/_user.model';

export class subscribeNotificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsString()
  @IsEnum(DeviceType)
  type: DeviceType = DeviceType.web;
}
