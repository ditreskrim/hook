import { createHash } from 'node:crypto';
declare global {
  interface String {
    reverse(): string;

    oneLine(): string;

    firstLine(): string;

    ucfirst(): string;

    cleanName(): string;

    cleanWhitespace(): string;

    getHash(): string;

    isJson(): boolean;

    isIpv4(): boolean;

    asNumber(): number;

    getCharCodeAt(): any;

    extractMatch(pattern: RegExp, replace?: string): string | null;

    toRegExp(pattern: string, flag: string): RegExp;

    toUri(scheme?: string): URL;

    format(...args: any[]): string;
  }
}
if (!String.prototype.extractMatch) {
  String.prototype.extractMatch = function (pattern: RegExp, replace: string = '$1') {
    const founds = String(this).match(pattern);
    if (!founds) return null;
    return founds.map((e: any) => String(e).replace(pattern, replace)).join('\n');
  };
}
if (!String.prototype.toRegExp) {
  String.prototype.toRegExp = function (pattern: string, flag: string = '$1') {
    return new RegExp(
      pattern.replace(/[\[\]\\{}()+*?.$^|]/g, function (match) {
        return '\\' + match;
      }),
      flag
    );
  };
}
if (!String.prototype.ucfirst) {
  String.prototype.ucfirst = function (): string {
    return this.split('')
      .map((v, i) => (i === 0 ? v.toUpperCase() : v))
      .join('');
  };
}
if (!String.prototype.oneLine) {
  String.prototype.oneLine = function (): string {
    return this.replace(/[\n\r]+/g, ' ').trim();
  };
}
if (!String.prototype.cleanName) {
  String.prototype.cleanName = function (): string {
    return this.replace(/[^A-Za-z0-9-_.]/g, '_').trim();
  };
}
if (!String.prototype.cleanWhitespace) {
  String.prototype.cleanWhitespace = function (): string {
    return this.replace(/\s+/g, ' ').trim();
  };
}
if (!String.prototype.firstLine) {
  String.prototype.firstLine = function (): string {
    return this.split(/\r\n|\r|\n/g)
      .filter((x: string) => x.length)
      .shift() as string;
  };
}
if (!String.prototype.reverse) {
  String.prototype.reverse = function (): string {
    return this.split('').reverse().join('');
  };
}
if (!String.prototype.toUri) {
  String.prototype.toUri = function (scheme = 'http'): URL {
    const base = String(this);
    return new URL(/^https?:\/\//i.test(base) ? base : '{0}://{1}'.format(scheme, base)) || undefined;
  };
}
if (!String.prototype.getHash) {
  String.prototype.getHash = function (): string {
    return createHash('sha256').update(this.toString()).digest('hex');
  };
}
if (!String.prototype.isJson) {
  String.prototype.isJson = function (): boolean {
    try {
      const o = JSON.parse(this.toString());
      return o && o.constructor === Object;
    } catch (e: any) {}
    return false;
  };
}
if (!String.prototype.isIpv4) {
  String.prototype.isIpv4 = function (): boolean {
    const founds = /^(?:https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i.exec(String(this));
    return founds
      ? founds[1].split('.').filter((num) => {
          const o = parseInt(num, 10);
          return !isNaN(o) && o >= 0 && o <= 255;
        }).length === 4
      : false;
  };
}
if (!String.prototype.asNumber) {
  String.prototype.asNumber = function (): number {
    const o = parseInt(String(this), 10);
    return !isNaN(o) ? o : 0;
  };
}
if (!String.prototype.getCharCodeAt) {
  String.prototype.getCharCodeAt = function (): any {
    const out: number[] = [];
    for (let i = 0; i < this.length; ++i) out.push(this.charCodeAt(i));
    return out.join(',');
  };
}
if (!String.prototype.format) {
  String.prototype.format = function () {
    const args = arguments;
    const regExp = /{(\d+)}|%[s|d]/g;
    let i = 0;
    return this.replace(regExp, function (match, n) {
      n = typeof n !== 'undefined' ? n : i++;
      return typeof args[n] !== 'undefined' ? String(args[n]) : match;
    });
  };
}
