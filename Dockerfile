FROM node:latest

RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee /etc/apt/sources.list.d/webupd8team-java.list
RUN echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886
RUN apt-get update
RUN apt-get install oracle-java8-installer -y  --force-yes --no-install-recommends

RUN java -version
RUN apt-get install oracle-java8-set-default

COPY ./web /web
WORKDIR /web

RUN npm update
RUN npm install
RUN npm update
RUN npm install --unsafe-perm -g sqlite3
RUN npm i --unsafe-perm ajv@^6.0.0 # something

CMD ["make", "serve"]