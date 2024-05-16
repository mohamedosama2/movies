import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
  } from '@nestjs/common';
  import * as amqp from 'amqp-connection-manager';
  import { Channel } from 'amqplib';
  import { Constants } from '../utils/constants';
  // import { RecieverOperationMessage } from './IMessageQueueService';
  
  @Injectable()
  export class MessageQueueService
    implements OnModuleInit, OnApplicationShutdown
  {
    private _connection: amqp.AmqpConnectionManager;
    private _operationsChannelWrapper: amqp.ChannelWrapper;
  
    async onModuleInit(): Promise<void> {
      const connectionUrl: string = process.env.AMQP_URL;
      await new Promise<void>(async (resolve, _reject) => {
        // Create a connection manager
        this._connection = await amqp.connect(connectionUrl);
  
        this._operationsChannelWrapper = await this._connection.createChannel({
          setup: function (channel: Channel) {
            return Promise.all([
              channel.assertQueue(Constants.MessageQueues.TEST1, {
                durable: true,
              }),
            ]);
          },
        });
  
        this._connection.on('connect', function () {
          console.log('\x1b[32m%s\x1b[0m', '[!] AMQP Connected: ', connectionUrl);
          resolve();
        });
  
        this._connection.on('disconnect', function (params) {
          console.log(
            '\x1b[31m%s\x1b[0m',
            '[!] AMQP Disconnected: ',
            params.err.stack,
          );
        });
      });
    }
  
    // publishToChannel
    async publishToChannel({ routingKey, exchangeName, data }): Promise<void> {
      return new Promise((resolve, reject) => {
        this._operationsChannelWrapper.publish(
          exchangeName,
          routingKey,
          Buffer.from(JSON.stringify(data), 'utf-8'),
          { persistent: true } as any,
          function (err, ok) {
            if (err) {
              return reject(err);
            }
            resolve();
          },
        );
      });
    }
  
    async onApplicationShutdown(signal?: string): Promise<void> {
      await this._connection.close();
      console.log(
        '\x1b[32m%s\x1b[0m',
        '[!]: Message Queue Service Is Now Closed',
      );
    }
  }
  