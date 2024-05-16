FROM node:14-alpine3.14 as builder


ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:14-alpine3.14

ENV NODE_ENV production
RUN  npm install pm2  -g
USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/ecosystem.config.js /home/node/ecosystem.config.js

CMD ["pm2-runtime", "start","ecosystem.config.js"]