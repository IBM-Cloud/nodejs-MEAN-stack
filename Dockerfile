FROM node:16-alpine

# Create app directory
RUN mkdir /src 
WORKDIR /src

# If you are building your code for production
# RUN npm ci --only=production

COPY ./package*.json /src/

RUN npm install

# Bundle app source
COPY ./server /src/server
COPY ./public /src/public
COPY ./server.js /src/server.js

ENV PORT 8080
EXPOSE 8080
CMD [ "npm", "start" ]
