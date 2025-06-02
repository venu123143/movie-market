# Use the official Bun image
FROM oven/bun:1 as builder

# Set working directory
WORKDIR /app

# Copy package files and env file
COPY package.json bun.lock

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Start a new stage for production
FROM oven/bun:1-slim

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

# Install only production dependencies
RUN bun install --production

# Expose the port the app runs on
EXPOSE 4173

# Start the application with host flag
CMD ["bun", "run", "preview", "--host", "0.0.0.0"] 