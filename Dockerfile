# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
# Copia dependencias primero (mejor cache de capas)
COPY package*.json ./
RUN npm install
# Copia el resto del código
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
