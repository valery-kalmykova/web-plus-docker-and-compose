FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.23.1-alpine AS production
WORKDIR /app
COPY --from=builder /app/nginx/conf.d/* ./etc/nginx/conf.d
COPY --from=builder /app/build ./usr/share/nginx/html
EXPOSE 8081
CMD [ "nginx", "-g", "daemon off;" ]