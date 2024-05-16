import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/models/_user.model';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import {
  Notification,
  NotificationDocument,
} from './notification.model';

@Injectable()
export class NotificationRepository extends BaseAbstractRepository<Notification> {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
  async countNotifications(user: UserDocument): Promise<number> {
    return await this.notificationModel.countDocuments({
      targetUsers: user._id,
      readBy: { $ne: user._id },
    });
  }
}
