FROM node:20-alpine

WORKDIR /app

# Install basic packages useful for dev
RUN apk add --no-cache libc6-compat bash git

# Copy package files and install deps (cached layer)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy repository (mounted by docker-compose during dev)
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 8081

# Run next in dev mode bound to all interfaces and port 8081
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "8081"]