import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join } from 'path';
import { envs } from '../../../../config/plugins/envs.plugin';
import { API_PREFIXES } from '../shared';

const prefix = API_PREFIXES.docs;

export const register = (router: Router) => {
  const openApiPath = join(__dirname, '../../openApi.yaml');
  const openApiSpec = YAML.load(openApiPath);
  const host = envs.HOST;

  if (openApiSpec.servers?.length) {
    const server = openApiSpec.servers[0];
    const serverUrl = host?.includes('localhost')
      ? `${host}:${envs.PORT}`
      : `${host}`;
    server.url = serverUrl;
  }

  router.use(prefix, swaggerUi.serve);
  router.get(
    prefix,
    swaggerUi.setup(openApiSpec, {
      explorer: true
    })
  );
};
