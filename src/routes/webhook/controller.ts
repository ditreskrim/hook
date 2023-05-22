import {FastifyReply, FastifyRequest} from 'fastify';
import {IWebhookRequest} from './schema';

export const HandleRequest = async (
    request: FastifyRequest<IWebhookRequest>,
    reply: FastifyReply,
) => {
    const params = {...request.query, ...request.params, ...request.body};
    console.warn('params',params);
    return reply.code(200).send({success: true});
};
