import FastifyStaticPlugin from '@fastify/static';
import FastifyFormbodyPlugin from '@fastify/formbody';
import FastifyMultipartPlugin from '@fastify/multipart';
import FastifyCorsPlugin from '@fastify/cors';
import fastifyHelmetPlugin from '@fastify/helmet';
import fastifyQsPlugin from 'fastify-qs';

import { join } from 'path';
import fp from 'fastify-plugin';
import { FastifyRequest } from 'fastify';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyRequest {
    web_url: string;
  }
}

const Onrequest = async function(request: FastifyRequest) {
  request.web_url = '//{0}{1}'.format(request.hostname, request.url.replace(/\/[^\/]+\.[a-z]{2,3}$/gi, ''));
  return request;
};
export default fp(
  async (fastify) => {
    fastify.register(fastifyQsPlugin, {});

    fastify.register(FastifyCorsPlugin, {
      hook: 'preHandler',
      origin: (_origin, cb) => {
        cb(null, true);
        return;
      },
      methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
      allowedHeaders: ['Origin', 'Accept', 'Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'X-Requested-With', 'observe']
    });
    fastify.register(fastifyHelmetPlugin, {
      contentSecurityPolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: false,
      permittedCrossDomainPolicies: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      hidePoweredBy: true
    });
    fastify.register(FastifyStaticPlugin, {
      root: join(__dirname, '../public'),
      prefix: '/',
      decorateReply: true,
      setHeaders(res: any) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      }
    });
    fastify.register(FastifyFormbodyPlugin);
    fastify.register(FastifyMultipartPlugin);
    fastify.addHook('onRequest', Onrequest);
  },
  { name: path.basename(__filename) }
);
