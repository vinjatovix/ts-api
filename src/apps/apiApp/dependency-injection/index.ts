import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection';
import { envs } from '../../../config/plugins/envs.plugin';

const container = new ContainerBuilder();
const loader = new YamlFileLoader(container);
const env = envs.NODE_ENV;

loader.load(`${__dirname}/application_${env}.yaml`);

export default container;
