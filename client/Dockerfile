FROM node:20-alpine AS builder

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install

COPY . .


RUN npm run build


FROM nginx:alpine AS final


COPY --from=builder /app/dist /usr/share/nginx/html


RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 8080


CMD ["/bin/sh", "-c", "envsubst '$VITE_SERVER_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp && mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
