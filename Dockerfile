# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/frontend/dist
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
