FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Vite port
EXPOSE 5173

# Start SvelteKit in dev mode, ensuring it binds to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]
