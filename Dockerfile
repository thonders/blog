FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    sqlite

# Set working directory
WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy existing application directory contents
COPY . /var/www

# Build the application
RUN node ace build

EXPOSE 80
CMD ["node", "./bin/server.js"]
