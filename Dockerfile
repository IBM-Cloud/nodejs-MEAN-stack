FROM node:8

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
COPY ./.env /src/.env


EXPOSE 6020
CMD [ "npm", "start" ]
