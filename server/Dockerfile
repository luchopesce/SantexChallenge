
FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh /app/wait-for-it.sh


EXPOSE 3000
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "run", "dev"]
