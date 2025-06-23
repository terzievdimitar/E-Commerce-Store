# 1. Build frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Build backend
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY package.json package-lock.json* ./
RUN npm install
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# 3. Production image
FROM node:20-slim
WORKDIR /app/backend
ENV NODE_ENV=production

COPY --from=backend-build /app/backend/package.json ./
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/. ./
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
COPY .env .env

EXPOSE 3000

CMD ["node", "server.js"]