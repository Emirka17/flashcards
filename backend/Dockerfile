# Используем официальный образ Go
FROM golang:1.26.5-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем go.mod и go.sum, скачиваем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь исходный код
COPY *.go ./

# Собираем бинарный файл (-o main)
RUN go build -o main .

# Открываем порт 8080
EXPOSE 8080

# Запускаем скомпилированный сервер
CMD ["./main"]