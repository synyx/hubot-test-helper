import Helper from '../src/index.mjs';
import * as http from 'http';

import { expect } from 'chai';
import path from "path";
import {fileURLToPath} from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const helper = new Helper(path.resolve(currentDirectory, './scripts/httpd-world.mjs'));

process.env.EXPRESS_PORT = '8080';

describe('httpd-world', () => {
  let room;
  let response;

  beforeEach(async () => {
    room = await helper.createRoom({httpd: true});
  });

  afterEach(() => {
    room.destroy();
  });

  context('GET /hello/world', () => {
    beforeEach(async() => {
      await new Promise((resolve) => {
        http.get('http://localhost:8080/hello/world', res => {
          response = res;
          resolve();
        }).on('error', resolve);
      });
    });

    it('responds with status 200', function() {
      expect(response.statusCode).to.equal(200);
    });
  });
});
