FROM node:8

# Create app directory
RUN mkdir /src
WORKDIR /src



# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./server /src/server
COPY ./public /src/public
COPY ./package.json /src/package.json
COPY ./server.js /src/server.js
COPY ./.env /src/.env

RUN npm install


EXPOSE 6001
CMD [ "npm", "start" ]
