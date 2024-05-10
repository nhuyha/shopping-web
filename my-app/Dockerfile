FROM alpine3.18
WORKDIR ./

RUN apk add --update nodejs npm 
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]