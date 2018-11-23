FROM arm32v7/debian:latest

EXPOSE 3010:3000

RUN mkdir -p /documentation

COPY builds/documentation /documentation/
COPY static/ /documentation/static

CMD ["/documentation/documentation", "-filePath", "/documentation/"]

