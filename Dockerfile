FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build


FROM node:22-alpine 

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY package.json .

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]