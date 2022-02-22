FROM node:16.13.0-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development
RUN npm install --global rimraf
COPY . .

RUN npm run build


FROM node:16.13.0-alpine As production

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist


ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

ARG PORT
ENV PORT ${PORT}

CMD ["node", "dist/main"]