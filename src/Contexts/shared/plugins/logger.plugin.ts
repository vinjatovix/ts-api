import winston from 'winston';
import 'winston-mongodb';
import { MongoClientFactory } from '../infrastructure/persistence/mongo/MongoClientFactory';
import { MongoConfigFactory } from '../infrastructure/persistence/mongo/MongoConfigFactory';

const { combine, timestamp, json } = winston.format;

const alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level} ${info.service} : ${info.message}`
  )
);

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

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      )
    })
  );
}

const setupMongoLogger = async (logger: winston.Logger) => {
  const mongoClient = await MongoClientFactory.createClient(
    'apiApp',
    MongoConfigFactory.createConfig()
  );

  const transportOptions = {
    db: Promise.resolve(mongoClient),
    collection: 'logs-winston',
    format: combine(timestamp(), json())
  };

  logger.add(new winston.transports.MongoDB(transportOptions));
};

if (process.env.NODE_ENV !== 'test') {
  setupMongoLogger(logger).catch((error) => {
    logger.error('Error setting up logger:', error);
  });
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
