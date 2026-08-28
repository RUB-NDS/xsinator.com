FROM golang:alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/xsinator-ws-server .

FROM alpine:latest
RUN adduser -D -u 10001 wsuser
COPY --from=build /out/xsinator-ws-server /xsinator-ws-server
EXPOSE 8080
USER wsuser
ENTRYPOINT ["/xsinator-ws-server"]
