#fix so we know it's Debian Jessie (8)
FROM node:9.8

# installs OpenJDK headless on Debian Jessie
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" | tee /etc/apt/sources.list.d/backports.list
RUN apt-get update
RUN apt install -t jessie-backports openjdk-8-jre-headless ca-certificates-java -y --force-yes --no-install-recommends

# tests java version, should be 1.8.x
RUN java -version

COPY ./web /web
WORKDIR /web

# updates npm and installs packages
RUN npm update
RUN npm install --unsafe-perm -g sqlite3
RUN npm i --unsafe-perm ajv@^6.0.0 # something
RUN npm update

CMD ["make", "serve"]
