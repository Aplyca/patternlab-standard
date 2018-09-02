FROM node:10.9.0-alpine
LABEL maintainer="Aplyca" description="Pattern Lab Standard Edition"

WORKDIR /app

COPY package.json package-lock.jso[n] ./
RUN if [ -f package-lock.json ]; then npm ci; else npm i; fi

COPY .babelrc .eslintrc .sass-lint.yml .stylintrc gulpfile.js patternlab-config.json ./
COPY src ./src
RUN npm run bundle
