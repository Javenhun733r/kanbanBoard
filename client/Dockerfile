FROM node:20-alpine AS builder

WORKDIR /app/client

COPY package.json package-lock.json ./
RUN npm install
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
COPY . .
RUN npm run build

FROM nginx:alpine AS final

EXPOSE 8080

RUN apk add --no-cache gettext

COPY --from=builder /app/client/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/nginx.conf.template

ENTRYPOINT ["/bin/sh", "-c", "envsubst '$$VITE_SERVER_URL' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
