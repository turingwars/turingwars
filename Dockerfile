FROM node:carbon

RUN apt-get update && apt-get install -y default-jre --no-install-recommends

COPY ./web /web
WORKDIR /web

RUN npm update && npm install && npm install --save sqlite3

CMD ["make", "serve"]