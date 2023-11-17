import Helper from '../src/index.js';

import { expect } from 'chai';
import path from "path";
import {fileURLToPath} from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/enter-leave.js'));

describe('enter-leave', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('user entering then leaving the room', async () => {
    beforeEach(async () => {
      await room.user.enter('user1');
      await room.user.leave('user1');
    });

    it('greets the user', () => {
      expect(room.messages).to.eql([
        ['hubot', 'Hi user1!'],
        ['hubot', 'Bye user1!']
      ]);
    });
  });
});
