import dotenv from 'dotenv';

import { ApiApp } from './ApiApp';

dotenv.config();

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
