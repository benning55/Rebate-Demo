 FROM node:15.4.0-alpine

WORKDIR /frontend
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install
COPY . .
RUN yarn