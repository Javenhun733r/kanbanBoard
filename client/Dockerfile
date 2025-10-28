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


CMD ["nginx", "-g", "daemon off;"]