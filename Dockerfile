FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

ARG VITE_BASE_PATH=/aipc/
ARG VITE_API_BASE_URL=/aipc/api/v1
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY server.js ./server.js
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
