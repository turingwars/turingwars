FROM node:carbon

RUN apt-get update && apt-get install -y default-jre --no-install-recommends

COPY ./web /web
WORKDIR /web

RUN npm update
RUN npm install
RUN npm update
RUN npm install --unsafe-perm -g sqlite3
RUN npm i --unsafe-perm ajv@^6.0.0 # something

CMD ["make", "serve"]