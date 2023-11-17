import Helper from '../src/index.js';

import { expect } from 'chai';
import path from "path";
import {fileURLToPath} from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(['./scripts/hello-world.js', './scripts/bye.js'].map(p => path.resolve(currentDirectory, p)));

describe('hello-world', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user says hi to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot hi');
      await room.user.say('bob',   '@hubot bye');
    });

    it('should reply to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob',   '@hubot bye'],
        ['hubot', '@bob bye']
      ]);
    });
  });
});
