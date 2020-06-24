FROM node:12-alpine

COPY package.json package-lock.json ./

RUN npm ci

COPY @passport-next/passport-apikey/package.json @passport-next/passport-apikey/package-lock.json ./@passport-next/passport-apikey/

RUN cd @passport-next/passport-apikey && npm ci && npm link

COPY . .

RUN npm link @passport-next/passport-apikey

EXPOSE 4242

CMD node index.js
