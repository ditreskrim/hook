import {FastifyPluginAsync} from 'fastify';
import {HandleRequest} from './controller';

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post('/', {}, HandleRequest);
    fastify.get('/', {}, HandleRequest);

};

export default routes;
