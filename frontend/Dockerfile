# 🔹 1. Используем официальный образ Node.js для билда фронтенда
FROM node:23 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Собираем фронтенд
RUN npm run build

# 🔹 2. Используем Nginx для раздачи статики
FROM nginx:alpine

# Удаляем дефолтный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранный фронтенд в директорию Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
