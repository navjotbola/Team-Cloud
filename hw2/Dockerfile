FROM node
WORKDIR /usr/src/app
COPY twitRestAPI /usr/src/app
RUN npm install
RUN npm install --save-dev mocha
RUN npm install --save-dev chai
RUN npm install --save-dev supertest
RUN npm test
EXPOSE 8080
CMD [ "npm", "start" ]
