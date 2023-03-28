
FROM node:16-alpine as builder

WORKDIR /app
COPY . .

RUN yarn
RUN yarn run build

FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./nginx/server.crt /etc/ssl/certs/server.crt
COPY ./nginx/server.key /etc/ssl/private/server.key

COPY --from=builder /app/build /usr/share/nginx/html