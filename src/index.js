import * as fs from 'fs';
import path from 'node:path';
import {Adapter, EnterMessage, LeaveMessage, Response, Robot, TextMessage, User} from 'hubot';

process.setMaxListeners(0);

class MockResponse extends Response {
  sendPrivate(...strings) {
    this.robot.adapter.sendPrivate(this.envelope, ...strings);
  }
}

class MockRobot extends Robot {
  constructor(httpd = false, botName = null, roomName = null) {
    super(null, httpd ?? false, botName ?? 'hubot', null);

    this.roomName = roomName ?? 'room1';
    this.messagesTo = {};

    this.Response = MockResponse;
  }

  async messageRoom(room, ...strings) {
    if (room === this.adapter.name) {
      strings.forEach((str) => this.adapter.messages.push(['hubot', str]));
    } else {
      if (!(room in this.messagesTo)) {
        this.messagesTo[room] = [];
      }
      strings.forEach((str) => this.messagesTo[room].push(['hubot', str]));
    }

    return Promise.resolve();
  }

  async loadAdapter(adapterPath = null) {
    this.adapter = new Room(this, this.roomName);
  }
}

class Room extends Adapter {
  // XXX: https://github.com/hubotio/hubot/pull/1390
  static messages(obj) {
    if (obj instanceof MockRobot) {
      return obj.adapter.messages;
    } else {
      return obj.messages;
    }
  }

  constructor(robot, name) {
    super();
    this.robot = robot;
    this.name = name;
    this.messages = [];

    this.privateMessages = {};

    this.user = {
      say: (userName, message, userParams) => this.receive(userName, message, userParams),
      enter: (userName, userParams) => this.enter(userName, userParams),
      leave: (userName, userParams) => this.leave(userName, userParams)
    };
  }

  async receive(userName, message, userParams) {
    let textMessage = null;
    if ((typeof message === 'object') && message) {
      textMessage = message;
    } else {
      const user = new User(userName, {room: this.name, ...userParams});
      textMessage = new TextMessage(user, message);
    }

    this.messages.push([userName, textMessage.text]);
    return await this.robot.receive(textMessage);
  }

  destroy() {
    if (this.robot.server) { this.robot.server.close(); }
  }

  reply(envelope, ...strings) {
    strings.forEach((str) => Room.messages(this).push(['hubot', `@${envelope.user.name} ${str}`]));
  }

  send(envelope, ...strings) {
    strings.forEach((str) => Room.messages(this).push(['hubot', str]));
  }

  sendPrivate(envelope, ...strings) {
    if (!(envelope.user.name in this.privateMessages)) {
      this.privateMessages[envelope.user.name] = [];
    }
    strings.forEach((str) => this.privateMessages[envelope.user.name].push(['hubot', str]));
  }

  robotEvent(event, ...args) {
    return this.robot.emit(event, ...args);
  }

  async enter(userName, userParams) {
    const user = new User(userName, {room: this.name, ...userParams});
    return this.robot.receive(new EnterMessage(user));
  }

  async leave(userName, userParams) {
    const user = new User(userName, {room: this.name, ...userParams});
    return this.robot.receive(new LeaveMessage(user));
  }
}

export default class Helper {
  constructor(scriptsPaths) {
    if (!Array.isArray(scriptsPaths)) {
      scriptsPaths = [scriptsPaths];
    }
    this.scriptsPaths = scriptsPaths;
  }

  async createRoom(options = null) {
    const robot = new MockRobot(options?.httpd ?? false, options?.name ?? null, options?.room ?? null);

    if (options?.response) {
      robot.Response = options.response;
    }

    await robot.loadAdapter();

    if (robot.shouldEnableHttpd){
      await robot.setupExpress();
    }

    const filePromises = [];
    for (const script of this.scriptsPaths) {
      let scriptPath = script;
      if(!path.isAbsolute(scriptPath)) {
        scriptPath = path.resolve(process.cwd(), scriptPath);
      }

      if (fs.statSync(scriptPath).isDirectory()) {
        for (let file of fs.readdirSync(scriptPath).sort()) {
          filePromises.push(robot.loadFile(scriptPath, file));
        }
      } else {
        filePromises.push(robot.loadFile(path.dirname(scriptPath), path.basename(scriptPath)));
      }
    }

    await Promise.all(filePromises);

    robot.brain.emit('loaded');

    return robot.adapter;
  }
}

Helper.Response = MockResponse;
