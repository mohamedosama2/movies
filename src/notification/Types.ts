import {
  AndroidConfig,
  ApnsConfig,
  FcmOptions,
  Notification,
  WebpushConfig,
} from 'firebase-admin/lib/messaging/messaging-api';
import { UserDocument } from 'src/users/models/_user.model';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';

export interface MessageBody {
  title: string;
  body: string;
  imageUrl?: string;
  icon?: string;
  requireInteraction?: boolean;
  link?: string;
  data?: {
    [key: string]: string;
  };
  mobileLink?: string;
  actions?: {
    title: string;
    action: string;
    icon?: string;
  }[];
}
export interface BaseMessageWithToken {
  data?: {
    [key: string]: string;
  };
  notification?: Notification;
  android?: AndroidConfig;
  webpush?: WebpushConfig;
  apns?: ApnsConfig;
  fcmOptions?: FcmOptions;
  token?: string;
}

export interface BaseMessageWithTokenTesting {
  data?: {
    [key: string]: string;
  };
  notification?: Notification;
  android?: AndroidConfig;
  webpush?: WebpushConfig;
  apns?: ApnsConfig;
  fcmOptions?: FcmOptions;
  token: string;
}

//  For More Info to custumize
//  https://firebase.google.com/docs/cloud-messaging/send-message
export const encodingDataForAllDevices = (
  messageData: MessageBody,
): BaseMessageWithToken => {
  const notificationWeb = {
    body: messageData.body,
    title: messageData.title,
    icon: messageData.icon,
    /*     requireInteraction: msg.requireInteraction ?? false, */
    image: messageData.imageUrl,
    actions: messageData.actions,
    data: messageData.data,
  };
  const notificationMobile = {
    imageUrl: messageData.imageUrl,
    body: messageData.body,
    title: messageData.title,
    icon: messageData.icon,
    color: '#00ff00', //testing MUSSSSSSST BE HEXA
    notificationCount: 5,
    clickAction: messageData.mobileLink,
    channelId: '', ////DEPLOY
  };
  return {
    webpush: {
      /*    headers: {
        image: messageData.imageUrl,
      }, */
      notification: notificationWeb,
      data: messageData.data,

      fcmOptions: {
        link: messageData.link ? messageData.link : 'www.google.com',
      },
    },
    android: {
      data: messageData.data,
      notification: notificationMobile,
    },
    notification: {
      body: messageData.body,
      imageUrl: messageData.imageUrl,
      title: messageData.title,
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1,
        },
      },
      fcmOptions: {
        imageUrl: messageData.imageUrl,
      },
    },
  };
};

export interface SendNotificationMethod extends UserDocument {
  sendNotification: (message: BaseMessageWithToken) => void;
}
export interface queryParamsWithId extends PaginationParams {
  targetUsers: string;
}
