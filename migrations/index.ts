import { database, config, up as migrationUp } from 'migrate-mongo';
import { buildLogger } from '../src/Contexts/shared/plugins/logger.plugin';
import { envs } from '../src/config/plugins/envs.plugin';
import { version } from '../package.json';

const logger = buildLogger('Migrations');

const user = envs.MONGO_USERNAME;
const password = encodeURIComponent(envs.MONGO_PASSWORD);
const host = envs.MONGO_URL;
const rs = `?replicaSet=${envs.MONGO_REPLICA_SET}`;
const databaseName = envs.MONGO_DB;
const connectionString = `mongodb://${user}:${password}@${host}/${databaseName}${rs}`;

config.set({
  mongodb: {
    url: connectionString
  },
  migrationsDir: `migrations/${version}`,
  changelogCollectionName: 'changelog'
});

logger.info(`Migrations version: ${version}`);

const up = async () => {
  const { db, client } = await database.connect();
  try {
    const migrated = await migrationUp(db, client);
    migrated.forEach((fileName) => logger.info(`Migrated: ${fileName}`));
  } catch (error) {
    logger.error((error as Error).message);
  } finally {
    await client.close();
  }
};

export default { up };
