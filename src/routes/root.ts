import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/test', async function () {
    return { test: true };
  });
  fastify.get('/client.js', {}, function (request, reply) {
    console.log(request.web_url)
    return reply.sendFile('hook.class.min.js');
  });

};

export default root;
