FROM arm32v7/node:latest

EXPOSE 8080

WORKDIR /webapp

COPY index.html ./
COPY index.js ./
COPY package.json ./

RUN npm install

CMD ["node", "index.js"]

