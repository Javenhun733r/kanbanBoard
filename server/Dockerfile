FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN rm -f prisma.config.ts || true
RUN npm run prisma:gen
RUN npm run build

FROM node:20-alpine AS final

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
COPY tsconfig.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
ENV NODE_ENV production
ENV PORT 3000

ENTRYPOINT ["/bin/sh", "-c"]

CMD ["npx prisma migrate deploy && npx ts-node --project tsconfig.json prisma/seed.ts && node dist/src/main.js"]

EXPOSE 3000