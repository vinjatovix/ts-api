import { Router } from 'express';
import { globSync } from 'glob';

export const registerRoutes = (router: Router) => {
  const routes = globSync('**/*.routes.*', {
    cwd: __dirname,
    ignore: '**/index.ts'
  });
  routes.forEach((route) => {
    _register(route, router);
  });
};

const _register = (routePath: string, router: Router) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const route = require(__dirname + '/' + routePath);
  route.register(router);
};
