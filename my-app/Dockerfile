FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y nodejs npm

COPY package.json ./
COPY package-lock.json ./

# Install all the dependencies specified in package.json
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Inform Docker that the container is listening on port 3000 at runtime
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "run", "dev"]
