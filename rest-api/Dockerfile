FROM golang:latest AS build-env

WORKDIR /go/src

COPY . .

RUN cd api-bob && go get -d -v && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o api-bob

FROM scratch

COPY --from=build-env /go/src/api-bob/api-bob api-bob
EXPOSE 8080

CMD ["./api-bob"]
