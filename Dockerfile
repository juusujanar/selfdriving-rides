FROM node:10-alpine
WORKDIR /srv

COPY . /srv/
RUN yarn install

CMD ["yarn", "start"]
