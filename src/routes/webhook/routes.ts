import {FastifyPluginAsync} from 'fastify';
import {HandleRequest} from './controller';

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post('/', {}, HandleRequest);
    fastify.get('/', {}, HandleRequest);
    fastify.options('/', (_request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        return reply.code(200);
    });
};

export default routes;
