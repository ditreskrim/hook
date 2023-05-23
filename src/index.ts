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
export const app: FastifyInstance = fastify(default_options);
app.register(fastifyApp);
export default async function (req:Object, res:Object){
    await app.ready();
    app.server.emit("request", req, res);
}
