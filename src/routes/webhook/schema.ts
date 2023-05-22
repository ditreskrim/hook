export type WebhookRequestDefault = Record<string, string | string[]>;
export interface IWebhookRequest {
  Body: WebhookRequestDefault;
  Querystring: WebhookRequestDefault;
  Params: WebhookRequestDefault;
}
