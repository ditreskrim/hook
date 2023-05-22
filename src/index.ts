import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyApp from './app';

const default_options = {
  ignoreTrailingSlash: true,
  caseSensitive: false,
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
};
const Instance = async (options: FastifyServerOptions = default_options) => {
  const instance: FastifyInstance = fastify(options);
  void instance.register(fastifyApp);
  void instance.listen();
  return instance;
};
export const InstanceApp = Instance();
export default Instance;
export { Instance, default_options };
