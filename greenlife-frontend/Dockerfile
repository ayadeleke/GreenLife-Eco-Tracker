# Stage 1: Build the frontend
FROM node:20 AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:1.25-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

