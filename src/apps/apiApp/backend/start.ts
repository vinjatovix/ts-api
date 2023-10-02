import dotenv from 'dotenv';
import path from 'path';
import { ApiApp } from './ApiApp';

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../../../config/${process.env.NODE_ENV}.env`
  )
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
