import winston from 'winston';
import 'winston-mongodb';
import { MongoClientFactory } from '../infrastructure/persistence/mongo/MongoClientFactory';
import { MongoConfigFactory } from '../infrastructure/persistence/mongo/MongoConfigFactory';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'logs/error-logs.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/info-logs.log' })
  ]
});

if (process.env.NODE_ENV !== 'test') {
  const setupMongoLogger = async (logger: winston.Logger) => {
    const mongoClient = await MongoClientFactory.createClient(
      'logs',
      MongoConfigFactory.createConfig()
    );

    const transportOptions = {
      db: Promise.resolve(mongoClient),
      collection: 'logs',
      format: combine(timestamp(), json())
    };

    try {
      logger.add(new winston.transports.MongoDB(transportOptions));
    } catch (error) {
      logger.error('Error setting up logger:', error);
    }
  };

  setupMongoLogger(logger);
}

if (!['production', 'test'].includes(process.env.NODE_ENV as string)) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.combine(
          winston.format.colorize({
            all: true
          }),
          winston.format.printf(
            (info) =>
              `[${info.level}] ${info.service} - ${info.timestamp} : ${info.message}`
          )
        )
      )
    })
  );
}

export const buildLogger = (service: string) => {
  return {
    debug: (message: string) => {
      logger.debug({ service, message });
    },
    info: (message: string) => {
      logger.info({ service, message });
    },
    warn: (message: string) => {
      logger.warn({ service, message });
    },
    error: (message: string) => {
      logger.error({ service, message });
    }
  };
};
