FROM node:14.16.1-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn run build

# Install serve globally (so we can run serve in the final CMD)
RUN yarn global add serve

# Expose port 8080 for Cloud Run or other environments
EXPOSE 8080

# Serve the production build on port 8080
CMD ["serve", "-s", "build", "-l", "8080"]
