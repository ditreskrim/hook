import fp from 'fastify-plugin';
import {
  Attachment,
  DiscordEmbedFields,
  Embded,
  SendDiscordWebhookMessage,
  WebHook,
} from '../utils/discord';
import * as process from 'process';
import { FastifyReply, FastifyRequest } from 'fastify';

export type WebhookRequestDefault = Record<string, string | string[]>;

export interface IWebhookRequest {
  Body: WebhookRequestDefault;
  Querystring: WebhookRequestDefault;
  Params: WebhookRequestDefault;
}

declare module 'fastify' {
  interface FastifyInstance {
    webhook?: WebHook;
    webhook_exlude_fields: Array<string>;
  }

  interface FastifyRequest {
    embed: Embded;

    createWebhookMessage(): Promise<SendDiscordWebhookMessage>;

    sendMessagetoWebhook(msg?: SendDiscordWebhookMessage): Promise<any>;
  }
}

export interface SupportPluginOptions {
  DISCORD_WEBHOOK?: string;
  exlude_fields?: Array<string>;
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
  const webhook = new WebHook(
    opts?.DISCORD_WEBHOOK ?? process.env.DISCORD_WEBHOOK!,
  );
  const exlude_fields: Array<string> = (opts?.exlude_fields || [])
    .concat(
      process.env?.WEBHOOK_EXCLUDE_FIELDS
        ? process.env.WEBHOOK_EXCLUDE_FIELDS.split(',')
        : [],
    )
    .filter((x) => x?.length);
  fastify.decorate('webhook', webhook);
  fastify.decorate('webhook_exlude_fields', exlude_fields);
  fastify.addHook(
    'onRequest',
    async function (
      _req: FastifyRequest<IWebhookRequest>,
      _reply: FastifyReply,
    ) {
      const uri = '{0}://{1}/'.format(_req.protocol, _req.hostname);
      _req.embed = new Embded({
        author: {
          name: _req.hostname,
          url: uri,
          icon_url: '{0}/favicon.ico'.format(uri),
        },
      });
      _req.sendMessagetoWebhook = async function (
        msg?: SendDiscordWebhookMessage,
      ) {
        return _req.server?.webhook?.sendMessage(
          msg ? msg : await _req.createWebhookMessage(),
        );
      };
      _req.createWebhookMessage = async function () {
        return new Promise(function (resolve, reject) {
          try {
            const params = { ..._req.query, ..._req.params, ..._req.body };
            const msg_json = params && JSON.stringify(params);
            for (const [k, v] of Object.entries(params)) {
              if (!k) continue;
              else if (_req.server.webhook_exlude_fields.includes(k)) continue;
              if (v.constructor === Object) {
                for (const [kk, vv] of Object.entries(v)) {
                  const field: DiscordEmbedFields = {
                    inline: true,
                    name: kk.ucfirst(),
                    value: String(vv),
                  };
                  _req.embed?.fields.push(field);
                }
              } else {
                _req.embed?.fields.push({
                  name: k.ucfirst(),
                  value: String(v),
                } as DiscordEmbedFields);
              }
            }
            if (!_req?.embed || _req?.embed.fields.length < 1)
              return reject(new Error('Fields Empty'));
            const payload = {
              content: _req.headers.origin as string,
              username: _req.hostname,
              embeds: [_req?.embed],
              files: [
                new Attachment(Buffer.from(msg_json), {
                  filename: '{0}.txt'.format(msg_json.getHash()).cleanName(),
                }),
              ],
            };
            return resolve(payload);
          } catch (e) {
            return reject(e);
          }
        });
      };
    },
  );
});
