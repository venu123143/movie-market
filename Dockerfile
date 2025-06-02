# === Stage 1: Build with Bun ===
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy files and install deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Copy app source and build
COPY . .
RUN bun run build

# === Stage 2: Serve with Nginx ===
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
