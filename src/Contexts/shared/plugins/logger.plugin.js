import winston from 'winston';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: 'logs/error-logs.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info-logs.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export const buildLogger = (service) => {
  return {
    debug: (message) => {
      logger.log('debug', { service, message });
    },
    info: (message) => {
      logger.info('info', { service, message });
    },
    error: (message) => {
      logger.error('error', { service, message });
    }
  };
};
