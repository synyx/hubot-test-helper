import Helper from '../src/index.js';

import { expect } from 'chai';
import path from "path";
import {fileURLToPath} from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/hello-world-listener.js'));

describe('hello-world', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user says hi to hubot', () => {
    beforeEach(async () => {
        await room.user.say('alice', '@hubot hi');
        await room.user.say('bob',   '@hubot hi');
    });

    it('should reply to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['bob',   '@hubot hi'],
        ['hubot', '@bob hi']
      ]);
    });
  });
});
