import { FastifyPluginAsync } from 'fastify';
import { HandleInstall, HandleRequest } from './controller';
type method = 'GET' | 'POST';
const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/', {}, HandleRequest);
  fastify.get('/', {}, HandleRequest);
  fastify.get('/install', {}, HandleInstall);
};

export default routes;
