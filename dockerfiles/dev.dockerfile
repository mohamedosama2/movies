FROM node:14-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install 

COPY . .

RUN npm run build

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
# CMD ["npm", "run", "start:dev"]
CMD ["node", "dist/main"]