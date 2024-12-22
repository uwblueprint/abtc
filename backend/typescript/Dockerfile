FROM node:16.13.0-slim

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

# RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
# # libcurl3 is required for mongodb-memory-server, which is used for testing
# RUN apt-get update && apt-get install -y libcurl3

RUN yarn add prisma@^4.15.0
RUN yarn add @prisma/client@^4.15.0

RUN yarn install

COPY . ./

RUN npx prisma generate

EXPOSE 5000
ENTRYPOINT ["yarn", "dev"]
