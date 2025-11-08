# Stage 1 — builder
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2 — nginx static server
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: custom nginx config for SPA (history pushState)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
