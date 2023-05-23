import {FastifyPluginAsync} from 'fastify';
import {HandleClient, HandleInstall} from './controller';

const routers: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/root', function (_request, _reply) {
        return _reply.send({root: true})
    });
    fastify.get('/example', function (_request, _reply) {
        return _reply.send('this is an example')
    });
    fastify.get('/client', HandleClient);
    fastify.get('/client.js', HandleClient);
    fastify.get('/install', HandleInstall);
    fastify.get('/install.js', HandleInstall);
};

export default routers;
