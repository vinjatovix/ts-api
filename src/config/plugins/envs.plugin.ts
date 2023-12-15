import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  HOST: env.get('HOST').required().asString(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),
  ALLOWED_ORIGINS: env.get('ALLOWED_ORIGINS').required().asString(),
  MONGO_CONNECTION: env.get('MONGO_CONNECTION').required().asString(),
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_DB: env.get('MONGO_DB').required().asString(),
  MONGO_USERNAME: env.get('MONGO_USERNAME').required().asString(),
  MONGO_PASSWORD: env.get('MONGO_PASSWORD').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString()
};
