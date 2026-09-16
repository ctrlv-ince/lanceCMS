FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npm", "run", "dev"]
