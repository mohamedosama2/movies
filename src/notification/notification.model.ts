import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/users/models/_user.model';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true })
  title: string;
  
  @Prop({ type: String, required: true })
  body: string;

 /*  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  receiver: string; */

  @Prop({
    type: String,
    default:
      'https://res.cloudinary.com/derossy-backup/image/upload/v1555206853/deross-samples/notifications/bell.png',
  })
  icon?: string;

  @Prop(Number)
  initiator?: number;

  /*   @Prop({ type: Boolean, default: false })
  read?: boolean; */

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'users',
      },
    ],
  })
  targetUsers?: (string | UserDocument)[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'users',
      },
    ],
  })
  readBy?: (string | UserDocument)[];

  @Prop({
    type: String,
    enum: [
      'post',
      'comment',
      'solution',
      'materila',
      'lesson',
      'exam',
      'session',
      'admin',
    ],
  })
  subjectType?: string;

  @Prop({ type: Types.ObjectId, refPath: 'subjectType' })
  subject?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
/* 
NotificationSchema.methods.toFirebaseNotification = function () {
  return {
    notification: {
      title: this.title,
      body: this.body,
    },
  };
};
 */
