FROM golang:latest AS build-env

WORKDIR /go/src

COPY . .

RUN cd api-bob && go get -d -v && go build -v -o api-bob

FROM scratch

COPY --from=build-env /go/src/api-bob/api-bob api-bob
RUN chmod +x api-bob

ENTRYPOINT ["./api-bob"]
