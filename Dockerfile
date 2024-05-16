
# Installing dependencies:
 
FROM node:14-alpine3.14 AS install-dependencies
 
WORKDIR /user/src/app
 
COPY package.json package-lock.json ./
 
RUN npm ci --omit=dev
 
COPY . .
 
 
# Creating a build:
 
FROM node:14-alpine3.14 AS create-build
 
WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app ./
 
RUN npm run build
 
USER node
 
 
# Running the application:
 
FROM node:14-alpine3.14 AS run
 
WORKDIR /user/src/app
 
COPY --from=install-dependencies /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]
 

# FROM node:14-alpine3.14 as builder

# ENV NODE_ENV build

# WORKDIR /home/node

# COPY . /home/node

# RUN npm ci \
#     && npm run build \
#     && npm prune --production

# # ---

# FROM node:14-alpine3.14

# ENV NODE_ENV production
# USER node
# WORKDIR /home/node

# COPY --from=builder /home/node/package*.json /home/node/
# COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
# COPY --from=builder /home/node/dist/ /home/node/dist/

# CMD ["node", "dist/main.js"]
