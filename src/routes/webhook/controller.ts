import { FastifyReply, FastifyRequest } from 'fastify';
import { IWebhookRequest } from '../../plugins/webhook';

export const HandleRequest = async (request: FastifyRequest<IWebhookRequest>, reply: FastifyReply) => {
  await request
    .sendMessagetoWebhook()
    .then(function(out) {
      console.warn('sendMessagetoWebhook', out?.id);
    })
    .catch(function(reason) {
      console.error('sendMessagetoWebhook', reason);
    });
  return reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({ success: true });
};
