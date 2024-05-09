FROM node:22-alpine3.18
WORKDIR ./

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]