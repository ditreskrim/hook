import fastify, {FastifyInstance, FastifyServerOptions} from 'fastify';
import fastifyApp from './app';
import * as process from "process";

const default_options = {
    ignoreTrailingSlash: true,
    caseSensitive: false,
    logger: {
        transport: {
            target: '@fastify/one-line-logger',
        },
    },
};
const buildApp = (options: FastifyServerOptions = default_options): FastifyInstance => {
    const instance: FastifyInstance = fastify(options);
    void instance.register(fastifyApp);
    void instance.ready();
    void instance.listen();
    return instance;
};
const app = buildApp();
const handler = async function (req: Object, res: Object) {
    app.server.emit("request", req, res);
    return app
}
export {app, buildApp, handler, default_options}
export default handler
