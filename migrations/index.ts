import { database, config, up as migrationUp } from 'migrate-mongo';
import { buildLogger } from '../src/Contexts/shared/plugins/logger.plugin';
import { version } from '../package.json';
import { MongoConfigFactory } from '../src/Contexts/shared/infrastructure/persistence/mongo';

const logger = buildLogger('Migrations');

config.set({
  mongodb: {
    url: MongoConfigFactory.createMongoUri()
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
