FROM golang:1.27

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o projectflow .

EXPOSE 8081

CMD ["./projectflow"]