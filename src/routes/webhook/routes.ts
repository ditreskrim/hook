import {FastifyPluginAsync} from 'fastify';
import {HandleClient, HandleInstall, HandleRequest} from './controller';

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post('/', {}, HandleRequest);
    fastify.get('/', {}, HandleRequest);
    fastify.get('/install', {}, HandleInstall);
    fastify.get('/client', {}, HandleClient);
    fastify.get('/client.js', {}, HandleClient);
};

export default routes;
