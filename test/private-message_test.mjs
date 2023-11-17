import Helper from '../src/index.mjs';

import { expect } from 'chai';
import path from "path";
import {fileURLToPath} from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/private-message.mjs'));

describe('private-message', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user asks hubot for a secret', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot tell me a secret');
    });

    it('should not post to the public channel', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot tell me a secret']
      ]);
    });

    it('should private message user', () => {
      expect(room.privateMessages).to.eql({
        'alice': [
          ['hubot', 'whisper whisper whisper']
        ]
      });
    });
  });
});
