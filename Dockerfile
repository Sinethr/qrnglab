FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Use non-root user for security
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
