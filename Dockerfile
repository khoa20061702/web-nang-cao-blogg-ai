FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/utils/summarizeLogic.ts ./src/utils/summarizeLogic.ts
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/tsconfig.json ./

# Cần tsx để chạy TypeScript server
RUN npm install -g tsx

EXPOSE 3000

CMD ["tsx", "server.ts"]
