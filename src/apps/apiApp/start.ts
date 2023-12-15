import { buildLogger } from '../../Contexts/shared/plugins/logger.plugin';
import { ApiApp } from './ApiApp';

const logger = buildLogger('API');

try {
  new ApiApp().start();
} catch (e) {
  logger.error("Error in ApiApp's start");
  process.exit(1);
}

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}, ${err.stack}`);
  process.exit(1);
});
