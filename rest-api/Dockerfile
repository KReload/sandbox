FROM golang:latest

WORKDIR /go/src

COPY . .

RUN cd api-bob && go build -v

EXPOSE 8080

CMD ["./api-bob/api-bob"]
