FROM node:14

# Create app directory

# RUN mkdir /src 
# This command above fails on Code Engine:
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk #5 [2/8] RUN mkdir /src
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk #5 0.079 container_linux.go:380: starting container process caused: process_linux.go:385: applying cgroup configuration for process caused: mountpoint for devices not found
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk #5 ERROR: process "/bin/sh -c mkdir /src" did not complete successfully: exit code: 1
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk ------
   #  > [2/8] RUN mkdir /src:
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk #5 0.079 container_linux.go:380: starting container process caused: process_linux.go:385: applying cgroup configuration for process caused: mountpoint for devices not found
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk ------
   # Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk Dockerfile:4
   ## Feb 3 06:02:21 Code Engine mean-stack-local-build-run-220203-060041645-cb7j7-pod-zflpk --------------------
      # 2 |     
      # 3 |     # Create app directory
      # 4 | >>> RUN mkdir /src
      # 5 |     WORKDIR /src
      # 6 |   

WORKDIR /src



# If you are building your code for production
# RUN npm ci --only=production

COPY ./package*.json /src/

RUN npm install

# Bundle app source
COPY ./models /src/models
COPY ./public /src/public
COPY ./server.js /src/server.js

ENV PORT 8080
EXPOSE 8080
CMD [ "npm", "start" ]
