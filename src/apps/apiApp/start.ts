import dotenv from 'dotenv';

import { ApiApp } from './ApiApp';

dotenv.config();

try {
  new ApiApp().start();
} catch (e) {
  console.error(e);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  process.exit(1);
});
