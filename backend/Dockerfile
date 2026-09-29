# Estágio de compilação (Build)
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência Go
COPY go.mod ./
RUN go mod download

# Copia o código fonte
COPY . .

# Compila o executável estático
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server main.go

# Estágio de execução (Runtime leve)
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copia o binário compilado do estágio anterior
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
