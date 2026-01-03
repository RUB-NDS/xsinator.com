FROM golang:1.20-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN go build -o xsinator-ws-server .

EXPOSE 8080

CMD ["./xsinator-ws-server"]
