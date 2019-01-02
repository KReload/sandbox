FROM golang:latest AS build-env

WORKDIR /go/src

COPY . .

RUN cd api-bob && go get -d -v && go build -v -o api-bob

FROM scratch

COPY --from=build-env api-bob api-bob
EXPOSE 8080

ENTRYPOINT ["api-bob"]
