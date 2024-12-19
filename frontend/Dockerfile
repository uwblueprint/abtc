FROM node:14.15.5-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

EXPOSE $PORT

# Limit Node.js memory to 512MB
ENTRYPOINT ["node", "--max-old-space-size=512", "node_modules/.bin/yarn", "start"]
