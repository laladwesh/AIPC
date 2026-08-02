FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY server.js ./server.js

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
