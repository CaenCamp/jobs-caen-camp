FROM node:12.12-alpine

ARG USER_ID

RUN addgroup docker && \
    adduser -S -h /home/docker -u ${USER_ID:-1000} -G docker docker && \
    mkdir -p /home/docker/composer /usr/src/app/var/uploads && \
    mkdir -p /home/docker/composer /usr/src/app/var/uploads/rppsProof && \
    mkdir -p /home/docker/composer /usr/src/app/var/uploads/avatar && \
    chown -R docker /home/docker /usr/src/app

WORKDIR /usr/src/app

USER docker

COPY . /user/src/app

EXPOSE 5000

CMD ["yarn", "dev"]
