import fastify, {FastifyInstance, FastifyServerOptions} from 'fastify';
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
const buildApp = (options: FastifyServerOptions = default_options) => {
    const instance: FastifyInstance = fastify(options);
    void instance.register(fastifyApp);
    void instance.ready();
    return instance;
};
const app: FastifyInstance = buildApp();
const handler = async function (req: Object, res: Object) {
    void app.listen();
    app.server.emit("request", req, res);
}
export {app,buildApp, handler,default_options}
export default handler
