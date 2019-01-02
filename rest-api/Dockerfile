FROM golang:latest AS build-env

WORKDIR /go/src

COPY . .

RUN cd api-bob && go get -d -v && go build -v -o /go/bin/api-bob

FROM scratch

COPY --from=build-env /go/bin/api-bob /go/bin/api-bob
EXPOSE 8080

CMD ["/go/bin/api-bob"]
