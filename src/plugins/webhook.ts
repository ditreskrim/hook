import { Attachment, DiscordEmbedFields, Embded, SendDiscordWebhookMessage, WebHook } from '../utils/discord';
import * as process from 'process';
import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import path from 'node:path';

export type WebhookRequestDefault = Record<string, string | string[]>;

export interface IWebhookRequest {
  Body: WebhookRequestDefault;
  Querystring: WebhookRequestDefault;
  Params: WebhookRequestDefault;
}

declare module 'fastify' {
  interface FastifyInstance {
    webhook?: WebHook;
    webhook_exclude_fields: Array<string>;
  }

  interface FastifyRequest {
    embed: Embded;

    createWebhookMessage(): Promise<SendDiscordWebhookMessage>;

    sendMessagetoWebhook(msg?: SendDiscordWebhookMessage): Promise<any>;
  }
}

export default fp(
  async (fastify: FastifyInstance) => {
    const webhook = new WebHook(process.env.DISCORD_WEBHOOK!);
    const blacklists: Array<string> = ['keywords', 'search']
    const exclude_fields: Array<string> = ['XSRF-TOKEN', 'captcha', 'time',  '_ym', '_ga', '_gtag', '_gid', '_gat_', 'twk_', 'TawkConnectionTime']
      .concat(process.env?.WEBHOOK_EXCLUDE_FIELDS ? process.env.WEBHOOK_EXCLUDE_FIELDS.split(',') : [])
      .filter((x) => x?.length);
    fastify.decorate('webhook', webhook);
    fastify.decorate('webhook_exclude_fields', exclude_fields);
    fastify.addHook('onRequest', async function(req: FastifyRequest<IWebhookRequest>) {
      const uri = '{0}://{1}/'.format(req.protocol, req.hostname);
      req.embed = new Embded({
        author: {
          name: req.hostname,
          url: uri,
          icon_url: '{0}/favicon.ico'.format(uri)
        }
      });
      req.sendMessagetoWebhook = async function(msg?: SendDiscordWebhookMessage) {
        const payload=msg ? msg : await req.createWebhookMessage()
        if(!payload) throw Error('Unable send message');
        return req.server?.webhook?.sendMessage(payload);
      };
      req.createWebhookMessage = async function() {
        return new Promise(function(resolve, reject) {
          try {
            const params: Record<string, unknown> = {
              guest: {ip:req.connection.remoteAddress,ua:req.headers['user-agent']},
              ...req.query, ...req.params, ...req.body
            };

            const msg_json = JSON.stringify(params, null, 4);
            console.warn('exclude', req.server.webhook_exclude_fields);
            for (const ex of req.server.webhook_exclude_fields) {
              const d = Object.keys(params).find(x => x.toLowerCase() === ex.toLowerCase() || x.toLowerCase().includes(ex.toLowerCase()));
              if (d) delete params[d];
            }
            console.warn('params', params);
            const blocked        = Object.keys(params).find(x => blacklists.includes(x.toLowerCase()));
            if(blocked) return reject('Blacklists : {0}'.format(blocked));
            for (const [k, v] of Object.entries(params)) {
              if (!k) continue;
              else if (!v) continue;
              if (v?.constructor === Object) {
                const vars: Record<string, unknown> = { ...v };
                for (const ex of req.server.webhook_exclude_fields) {
                  const d = Object.keys(vars).find(x => x.toLowerCase() === ex.toLowerCase() || x.toLowerCase().includes(ex.toLowerCase()));
                  if (d) delete vars[d];
                }
                for (const [kk, vv] of Object.entries(vars)) {
                  const field: DiscordEmbedFields = {
                    inline: true,
                    name: kk.ucfirst(),
                    value: String(vv)
                  };
                  req.embed?.fields.push(field);
                }
              } else {
                req.embed?.fields.push({
                  name: k.ucfirst(),
                  value: String(v)
                } as DiscordEmbedFields);
              }
            }
            if (!req?.embed) return reject(new Error('Fields Empty'));
            else if (req?.embed.fields.length < 3) return reject(new Error('Fields length should be greater than 3'));
            const payload = {
              content: req.headers.origin as string,
              username: req.hostname,
              embeds: [req?.embed],
              files: [
                new Attachment(Buffer.from(msg_json), {
                  filename: '{0}.txt'.format(msg_json.getHash()).cleanName()
                })
              ]
            };
            return resolve(payload);
          } catch (e) {
            console.error(e);
            return reject(e);
          }
        });
      };
      return fastify;
    });
  },
  { name: path.basename(__filename) }
);
