FROM oven/bun:1-alpine AS frontend-builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_BASE_URL
ARG VITE_S3_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_S3_URL=$VITE_S3_URL

COPY package.json bun.lockb* ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]