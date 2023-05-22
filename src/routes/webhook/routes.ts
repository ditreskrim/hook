import {FastifyPluginAsync} from 'fastify';
import {HandleRequest} from './controller';

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post('/', {}, HandleRequest);
    fastify.get('/', {}, HandleRequest);
    fastify.options('/', (_request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
        reply.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        return reply.code(204);
    });
};

export default routes;
