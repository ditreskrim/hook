import FastifyStaticPlugin from '@fastify/static';
import FastifyCookiePlugin from '@fastify/cookie';
import FastifyFormbodyPlugin from '@fastify/formbody';
import FastifyCorsPlugin from '@fastify/cors';
import fastifyHelmetPlugin from '@fastify/helmet';
import {join} from 'path';
import fp from 'fastify-plugin';
import {FastifyRequest} from 'fastify';

declare module 'fastify' {
    export interface FastifyRequest {
        web_url: string;
    }
}

export interface CommonsPluginOptions {
    // Specify Support plugin options here
}

const Onrequest = async function (request: FastifyRequest) {
    request.web_url = '//{0}{1}'.format(
        request.hostname,
        request.url.replace(/\/[^\/]+\.[a-z]{2,3}$/gi, ''),
    );
    return request.server;
};
export default fp<CommonsPluginOptions>(async (fastify) => {
    fastify.register( FastifyCorsPlugin,{hook: 'preHandler', origin: "*", methods: ['GET', 'PUT', 'POST']});
    fastify.register( fastifyHelmetPlugin,{
        contentSecurityPolicy: false,
        referrerPolicy: false,
        frameguard: { action: 'deny' },
        permittedCrossDomainPolicies: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        hidePoweredBy: true,
    });
    fastify.register(FastifyStaticPlugin, {
        root: join(__dirname, '../public'),
        prefix: '/',
        decorateReply: true,
        setHeaders(res: any) {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    });
    fastify.register(FastifyFormbodyPlugin);
    fastify.register(FastifyCookiePlugin, {
        secret: 'cookie-secret',
    });
    fastify.addHook('onRequest', Onrequest);

});
