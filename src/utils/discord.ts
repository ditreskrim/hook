import axios, {AxiosRequestConfig} from "axios";
import {AppendOptions} from "form-data";
import {createReadStream, ReadStream} from "fs";

const FormData = require("form-data");

export interface DiscordObject {
    id: string;
}

export interface DiscordUser extends DiscordObject {
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}

interface DiscordEmbedLinkedComponent {
    url?: string;
}

interface DiscordEmbedLinkedMediaContent extends DiscordEmbedLinkedComponent {
    proxy_url?: string;
    height?: number;
    width?: number;
}

export interface DiscordEmbedFooter {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export interface DiscordEmbedImage extends DiscordEmbedLinkedMediaContent {
}

export interface DiscordEmbedThumbnail extends DiscordEmbedLinkedMediaContent {
}

export interface DiscordEmbedVideo extends DiscordEmbedLinkedMediaContent {
}

export interface DiscordEmbedProvider extends DiscordEmbedLinkedComponent {
    name?: string;
}

export interface DiscordEmbedAuthor extends DiscordEmbedLinkedComponent {
    name?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export interface DiscordEmbedFields {
    name: string;
    value: string;
    inline?: boolean;
}

export const DiscordEmbedType = {
    rich: "rich",
    image: "image",
    video: "video",
    gifv: "gifv",
    article: "article",
    link: "link",
} as const;
export type DiscordEmbedType =
    typeof DiscordEmbedType[keyof typeof DiscordEmbedType];

export interface DiscordAllowedMentions {
    parse?: AllowedMentionTypes[];
    roles?: string[];
    users?: string[];
    replied_user?: boolean;
}

export type AllowedMentionTypes = "roles" | "users" | "everyone";
export type DiscordButtonsComponentType = {
    type: DiscordEmbedComponentType;
    custom_id?: string;
    disabled?: boolean;
    style?: number;
    label?: string;
    emoji?: DiscordEmoji;
    url?: string;
};
export type DiscordSelectMenusComponentType = {
    type: DiscordEmbedComponentType;
    custom_id?: string;
    disabled?: boolean;
    options: SelectOptions[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
};
export type DiscordActionRowsComponentType = {
    type: DiscordEmbedComponentType;
    components?: DiscordComponent[];
};
export type DiscordComponent =
    | DiscordButtonsComponentType
    | DiscordSelectMenusComponentType
    | DiscordActionRowsComponentType;
export const DiscordEmbedComponentType = {
    Action_Row: 1,
    Button: 2,
    Select_Menu: 3,
} as const;
export type DiscordEmbedComponentType =
    typeof DiscordEmbedComponentType[keyof typeof DiscordEmbedComponentType];

export interface SelectOptions {
    label: string;
    value: string;
    description?: string;
    emoji?: DiscordEmoji;
    default?: boolean;
}

export interface DiscordEmoji {
    id: string | null;
    name: string | null;
    roles?: DiscordRoles[];
    user?: DiscordUser;
    require_colons?: boolean;
    managed?: boolean;
    animatd?: boolean;
    available?: boolean;
}

export interface DiscordRoles {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: string;
    managed: boolean;
    mentionalbe: boolean;
    tags?: DiscordRoleTags;
}

export interface DiscordRoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
}

export interface DiscordEmbed {
    title?: string;
    type: DiscordEmbedType; // webhook 사용시 항상 rich
    description?: string;
    url?: string;
    timestamp?: Date; // ISO8601 timestamp
    color?: number;
    footer?: DiscordEmbedFooter;
    image?: DiscordEmbedImage;
    thumbnail?: DiscordEmbedThumbnail;
    video?: DiscordEmbedVideo;
    provider?: DiscordEmbedProvider;
    author?: DiscordEmbedAuthor;
    fields?: DiscordEmbedFields[];
}

export interface SendDiscordWebhookMessage {
    content: string; // content, file, embeds 셋 중 하나는 필수
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    files?: Attachment[]; // content, file, embeds 셋 중 하나는 필수
    embeds?: DiscordEmbed[]; // content, file, embeds 셋 중 하나는 필수
    payload_json?: string; // multipart/form-data only
    allowed_mentions?: DiscordAllowedMentions;
    components?: DiscordComponent[];
}

export class Embded implements DiscordEmbed {
    type: DiscordEmbedType;
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date; // ISO8601 timestamp
    color?: number;
    footer?: DiscordEmbedFooter;
    image?: DiscordEmbedImage;
    thumbnail?: DiscordEmbedThumbnail;
    video?: DiscordEmbedVideo;
    provider?: DiscordEmbedProvider;
    author?: DiscordEmbedAuthor;
    fields: DiscordEmbedFields[];

    constructor(opts: Partial<DiscordEmbed>) {
        this.type = opts.type ?? DiscordEmbedType.rich;
        this.timestamp = opts.timestamp ?? new Date();
        this.fields = opts.fields ?? [];
        this.color = opts.color ?? Math.floor(Math.random() * 10000000);
        this.provider = opts.provider ?? {name: "Gatlab™"}
        this.footer = opts.footer ?? {
            text: 'Gatlab™',
            icon_url: 'https://avatars.githubusercontent.com/u/112801555?s=200&v=4',
            proxy_icon_url: 'https://avatars.githubusercontent.com/u/112801555?s=200&v=4'
        };
        Object.assign(this, opts);
    }
}

export class Attachment {
    input: string | ReadStream | Buffer
    options?: string | AppendOptions

    constructor(input: string | ReadStream | Buffer, opt?: string | AppendOptions) {
        this.input = typeof input == "string" ? createReadStream(input) : input
        this.options = opt
    }
}

const delay = (ms: number) => new Promise<void>(function (resolve) {
    setTimeout(resolve, ms);
});

export class WebHook {
    url: string;

    constructor(webhook_url: string) {
        this.url = webhook_url
    }

    async sendMessage(msg: Partial<SendDiscordWebhookMessage>, max_retry = 50) {
        try {
            const configs: AxiosRequestConfig = {validateStatus: () => true}
            let payload = msg
            if (msg.files) {
                const form = new FormData();
                let i = 0
                for (const f of msg.files) {
                    form.append(`file${i}`, f.input, f.options)
                    i++;
                }
                delete msg.files;
                configs.headers = form.getHeaders()
                form.append('payload_json', JSON.stringify(msg))
                payload = form
            }
            let try_again = true
            let counter = 0
            let out = new Error('Webhook Unable send')
            while (try_again && counter <= max_retry) {
                const e = await axios.post(this.url, payload, configs)
                if (e.status === 429) {
                    const waitUntil = e.data.retry_after;
                    await delay(waitUntil)
                    counter++
                } else {
                    try_again = false
                    out = [200, 204].includes(e.status) ? e.data : new Error(`Error sending webhook: ${e.status} status code. Response: ${e.data}`);
                    break
                }
            }
            return Promise.resolve(out)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}

exports.default = WebHook;
