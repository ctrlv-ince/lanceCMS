FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Sanity Studio port
EXPOSE 3333

# Start Sanity Studio in dev mode
CMD ["npx", "sanity", "dev", "--host", "0.0.0.0"]
