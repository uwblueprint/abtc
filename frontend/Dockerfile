FROM node:14.15.5-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn run build

EXPOSE $PORT

CMD ["yarn", "global", "add", "serve"]
CMD ["serve", "-s", "build"]

