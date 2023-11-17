import Helper from '../src/index.mjs';
import * as Hubot from 'hubot';
import path from 'path';
import { fileURLToPath } from 'url'

import { expect } from 'chai';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/custom-text-message.mjs'));

describe('custom-text-message', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('Passing a custom text message object', () => {
    beforeEach(async () => {
      const textMessage = new Hubot.TextMessage({}, '');
      textMessage.isCustom = true;
      textMessage.custom = 'custom';
      await room.user.say('user', textMessage);
    });

    it('sends back', () => {
      expect(room.messages[1][1]).to.be.equal('custom');
    });
  });
});
