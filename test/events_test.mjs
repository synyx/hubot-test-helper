import Helper from '../src/index.mjs';

import { expect } from 'chai';
import path from "path";
import { fileURLToPath } from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/events.mjs'));

describe('events', () => {
  let room;

  beforeEach(async () => {
    room = await helper.createRoom();
  });

  context('should post on an event', () => {
    beforeEach(() => {
      room.robotEvent('some-event', 'event', 'data');
    });

    it('should reply to user', () => {
      expect(room.messages).to.eql([
        ['hubot', 'got event with event data']
      ]);
    });
  });

  context('should hear events emitted by responses', () =>
    it('should trigger an event', () => {
      let response = null;
      room.robot.on('response-event', event => response = event.content);

      room.user.say('bob', '@hubot send event').then(() => {
        expect(response).to.eql('hello');
      });
    })
  );
});
