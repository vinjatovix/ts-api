import dotenv from 'dotenv';
import path from 'path';
import { ApiApp } from './ApiApp';

const envPath = path.resolve(__dirname, `./config/${process.env.NODE_ENV}.env`);

console.log(envPath);
dotenv.config({
  path: envPath
});

try {
  new ApiApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
  process.exit(1);
});
