
FROM node:19-alpine as builder
WORKDIR /app
ADD . .
RUN yarn install
RUN yarn run build
RUN yarn install --production --frozen-lockfile

FROM node:19-alpine as runner
ENV NODE_ENV production
RUN npm install -g  pm2@latest
COPY --from=builder /app/dist /app
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/node_modules /app/node_modules
WORKDIR /app
RUN find  . -type d  -maxdepth 1 -exec chown -R node:node  {} \;
RUN rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man \
    && rm -rf /tmp/* \
    && rm -rf /tmp/{,.[!.],..?}* \
    && rm -rf /var/tmp/{,.[!.],..?}*
USER node
EXPOSE 3000
ENV PORT 3000
CMD ["pm2-runtime", "node", "--", "run.js"]
