import fastify, {FastifyInstance, FastifyServerOptions} from 'fastify';
import fastifyApp from './app';
// noinspection ES6UnusedImports
const _vercel_required_this =require('@fastify/one-line-logger');
const default_options :FastifyServerOptions= {
    ignoreTrailingSlash: true,
    caseSensitive: false,
    logger:{
        transport: {
            target: '@fastify/one-line-logger',
        }}
};
const buildApp = (
    options: FastifyServerOptions = default_options,
): FastifyInstance => {
    const instance: FastifyInstance = fastify(options);
    void instance.register(fastifyApp);
    return instance;
};
const app = buildApp();
const handler = async function (_req: Object, _res: Object) {
    await app.ready();
    void app.server.emit("request", _req, _res);
    return app;

};
export {app, buildApp, handler, default_options};
export default handler;
