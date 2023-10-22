import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join } from 'path';

const prefix = '/api/v1/Docs';

export const register = (router: Router) => {
  const openApiPath = join(__dirname, '../../openApi.yaml');
  const openApiSpec = YAML.load(openApiPath);
  const host = process.env.HOST;

  if (openApiSpec.servers?.length) {
    const server = openApiSpec.servers[0];
    const serverUrl = host?.includes('localhost')
      ? `${host}:${process.env.PORT}`
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
