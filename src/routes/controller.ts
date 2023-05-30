import { FastifyReply, FastifyRequest } from 'fastify';
import * as esbuild from 'esbuild';

export const HandleInstall = async (request: FastifyRequest, reply: FastifyReply) => {
  const inline_script = `if (typeof inject_hook !== 'function') {
  function inject_hook() {
    return new Promise(function(resolve, reject) {
      let s;
      s = document.createElement('script');
      s.src = String.fromCharCode({ server });
      s.id = 'hook-loader';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
}
inject_hook().then(function() {
    window._LOL = window._LOL ?? new Hook();
    window._LOL.init('form');
  }).catch(console.error);
`.replace('{server}', '{0}/client.js?cache=ignore'.format(request.web_url.replace('/install', '')).getCharCodeAt());
  return esbuild
    .build({
      stdin: { contents: inline_script, loader: 'js' },
      minify: true,
      write: false,
      target: 'chrome58',
      outdir: 'public/install.js',
    })
    .then(function ({ outputFiles }) {
      const out = outputFiles.pop();
      return reply
        .status(200)
        .type('text/javascript')
        .send(out?.text ?? inline_script.replace(/\n/g, ' '));
    })
    .catch(function () {
      return reply.status(200).type('text/javascript').send(inline_script.replace(/\n/g, ' '));
    });
};
export const HandleClient = async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.sendFile('hook.class.min.js');
};
