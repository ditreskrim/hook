import fs from 'node:fs';

export const identifierSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      description: 'the unique identifier',
    },
  },
  required: ['id'],
};

export function TryCatch(fn: Function) {
  try {
    return fn();
  } catch (err) {
    console.error(err?.message ?? err);
    return false;
  }
}
export const is_docker = (): boolean =>
  TryCatch(function () {
    if (!fs.existsSync('/.dockerenv')) return false;
    return !!fs.statSync('/.dockerenv');
  }) ||
  TryCatch(function () {
    if (!fs.existsSync('/proc/self/cgroup')) return false;
    return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
  });
