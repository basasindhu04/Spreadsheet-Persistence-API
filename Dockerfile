FROM node:18-slim

# Install curl for the healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure the data directory exists
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["npm", "start"]