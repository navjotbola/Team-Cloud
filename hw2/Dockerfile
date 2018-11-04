FROM node
WORKDIR /usr/src/app
COPY twitRestAPI /usr/src/app
RUN npm install
RUN npm run client-install
RUN npm test
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
EXPOSE 8080
CMD [ "npm", "run", "dev" ]
