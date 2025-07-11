# Dockerfile

# Use Node.js 22.15.0 slim as a base image for building
FROM node:22.15.0-slim AS builder

WORKDIR /app

# Install openssl for prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy root package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies for the entire monorepo
# Since it's a monorepo, we need all package.json files for `npm install` to work correctly.
COPY packages/car-management-api/package.json ./packages/car-management-api/
COPY packages/car-management-dashboard/package.json ./packages/car-management-dashboard/

RUN npm install

# Copy the rest of the source code
# The .dockerignore file will prevent local node_modules from being copied.
COPY . .

# Generate Prisma client which is needed for building the api
RUN npm exec -w car-management-api -- prisma generate

# Build the frontend application
RUN npm run build -w car-management-dashboard

# Build the backend application
RUN npm run build -w car-management-api


# Use a clean, lightweight Node.js image for the final production environment
FROM node:22.15.0-slim

WORKDIR /app

ENV NODE_ENV=production

# Install openssl for prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files from the builder stage to install production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/packages/car-management-api/package.json ./packages/car-management-api/
COPY --from=builder /app/packages/car-management-dashboard/package.json ./packages/car-management-dashboard/

# Install production dependencies
RUN npm install --omit=dev

# Copy the built backend application artifacts
COPY --from=builder /app/packages/car-management-api/dist ./packages/car-management-api/dist
# Copy the built frontend application to the location the backend will serve it from
COPY --from=builder /app/packages/car-management-dashboard/dist ./packages/car-management-api/dist/dashboard

# Copy Prisma schema file required by Prisma Client at runtime
COPY --from=builder /app/packages/car-management-api/prisma ./packages/car-management-api/prisma

# Generate prisma client in production image
RUN npm exec -w car-management-api -- prisma generate

# Expose the port the application will run on
EXPOSE 443

# Define the command to start the application
CMD ["sh", "-c", "npm start -w car-management-api"] 