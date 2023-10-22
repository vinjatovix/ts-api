import convict from 'convict';

const apiAppConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test', 'local'],
    default: 'local',
    env: 'NODE_ENV'
  },
  mongo: {
    connection: {
      doc: 'The Mongo connection',
      format: String,
      env: 'MONGO_CONNECTION',
      default: 'mongodb'
    },
    url: {
      doc: 'The Mongo connection url',
      format: String,
      env: 'MONGO_URL',
      default: 'localhost:27017/'
    },
    db: {
      doc: 'The Mongo connection db',
      format: String,
      env: 'MONGO_DB',
      default: 'none'
    },
    username: {
      doc: 'The Mongo connection username',
      format: String,
      env: 'MONGO_USERNAME',
      default: 'none'
    },
    password: {
      doc: 'The Mongo connection password',
      format: String,
      env: 'MONGO_PASSWORD',
      default: 'none'
    }
  }
});

apiAppConfig.loadFile([__dirname + '/' + apiAppConfig.get('env') + '.json']);

export default apiAppConfig;
