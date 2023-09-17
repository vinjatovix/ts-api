import dotenv from 'dotenv';
import path from 'path';
import { ApiApp } from './ApiApp';

const envFile = process.env.NODE_ENV === 'production' ? 'pro.env' : 'dev.env';
const envFilePath = path.resolve(__dirname, `../../../../config/${envFile}`);
dotenv.config({
  path: envFilePath
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
