import { FastifyReply, FastifyRequest } from 'fastify';
import { IWebhookRequest } from '../../plugins/webhook';

export const HandleRequest = async (
  request: FastifyRequest<IWebhookRequest>,
  reply: FastifyReply,
) => {
  const params = { ...request.query, ...request.params, ...request.body };
  await request
    .sendMessagetoWebhook()
    .then(function (out) {
      console.warn('sendMessagetoWebhook', out?.id);
    })
    .catch(function (reason) {
      console.error('sendMessagetoWebhook', reason);
    });
  console.warn('params', params);
  return reply.code(200).send({ success: true });
};
