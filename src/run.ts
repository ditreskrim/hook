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
const buildApp = (
  options: FastifyServerOptions = default_options,
): FastifyInstance => {
  const instance: FastifyInstance = fastify(options);
  void instance.register(fastifyApp);
  void instance.ready();
  void instance.listen({ port: Number(process.env.PORT ?? 3000) ,host:process.env.HOST ?? '0.0.0.0'});
  return instance;
};
const app = buildApp();
const handler = async function (_req: Object, _res: Object) {
  return app;
};
export { app, buildApp, handler, default_options };
export default handler;
