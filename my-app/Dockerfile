FROM alpine:3.18
WORKDIR /app

# Install Node.js and npm
RUN apk add --update nodejs npm

COPY package.json ./
COPY package-lock.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]