# Etapa 1: Build angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: Server con Ngnix
FROM nginx:alpine
COPY --from=build /app/dist/app-restaurante /usr/share/ngnix/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
