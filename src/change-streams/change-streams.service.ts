import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ChangeStream } from 'mongodb';
import * as storage from 'node-persist';
import * as EJSON from 'mongodb-extjson';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class ChangeStreamsService implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    this.changeStreams();
  }

  constructor(private readonly userRepository: UserRepository) {}

  async changeStreams(): Promise<void> {
    console.log('From Change Streams Service');
    const matchStages = [
      {
        $match: {
          $or: [
            { 'fullDocument.name': 'remah' }, // necessary to capture inserts
          ],
        },
      },
    ];

    const CS_TOKEN_KEY = 'changeStreamResumeToken';
    try {
      let changeStream: ChangeStream<any>;
      await storage.init({ dir: 'storageForResumeToken' });
      const token = await storage.getItem(CS_TOKEN_KEY);
      if (token !== undefined) {
        console.log(`using resume token: ${token}`);
        changeStream = this.userRepository.watch(matchStages, {
          resumeAfter: EJSON.parse(token),
        });
      } else {
        changeStream = this.userRepository.watch(matchStages);
      }
      console.log('polling change stream...');
      changeStream.on('change', (change, err) => {
        if (err) {
          console.log('########## ', err);
        }
        console.log(change);
        let resumeToken = EJSON.stringify(change._id);
        storage.setItem(CS_TOKEN_KEY, resumeToken);
      });
    } catch (err) {
      console.log('error from catch section');
      console.log(err);
    }
  }
}
