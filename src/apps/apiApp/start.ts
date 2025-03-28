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

process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    if (reason instanceof Error) {
      logger.error(
        `Unhandled Rejection: ${reason.name} - ${reason.message}, ${reason.stack} ${JSON.stringify(promise)}`
      );
    } else {
      logger.error(`Unhandled Rejection:  ${JSON.stringify(reason)}`);
    }
    process.exit(1);
  }
);
