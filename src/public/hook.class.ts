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

interface IHook {
  send(payload: object): Promise<void>;

  bind(selector: string): void;

  init(selector: string): void;
}

class Hook implements IHook {
  // @ts-ignore
  protected uri = new URL(document?.currentScript?.src);

  async send(payload: object) {
    console.warn('send', payload);
    const srv = this.uri.origin + this.uri.pathname.split('/').slice(0, -1).join('/');
    return await fetch(srv, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy :"unsafe-url",
      credentials: "include",
      redirect: "follow",
      body: { origin: window.location.href, ...payload }.serializeJSON(),
    })
      .then((response) => {
        console.warn('fetch', response.status);
        return response.text();
      })
      .catch((reason) => reason);
  }

  bind(selector: string) {
    const element = document.querySelector(selector) as HTMLFormElement;
    element.addEventListener('submit', async (event) => {
      this.send(event.target.serializeObject())
        .then(function (data) {
          console.error('bind', data);
          event.preventDefault();
        })
        .catch(function (reason) {
          console.error('bind', reason);
          event.preventDefault();
        });
    });
  }

  init(selector: string) {
    window.document.addEventListener(
      'DOMContentLoaded',
      () => this.bind(selector),
      true,
    );
  }
}
