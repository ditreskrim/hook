interface String {
  // add you custom properties and methods
  format(...args: any[]): string;
  getCharCodeAt(...args: any[]): string;
}

String.prototype.format = function () {
  const args = arguments;
  const regExp = /{(\d+)}|%[s|d]/g;
  let i = 0;
  return this.replace(regExp, function (match, n) {
    n = typeof n !== 'undefined' ? n : i++;
    return typeof args[n] !== 'undefined' ? String(args[n]) : match;
  });
};
String.prototype.getCharCodeAt = function (): string {
  const out: number[] = [];
  for (let i = 0; i < this.length; ++i) out.push(this.charCodeAt(i));
  return out.join(',');
};
