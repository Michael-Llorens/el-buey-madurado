FROM node:20-alpine AS builder
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# env para build (Mongo, Cloudinary, etc.)
COPY .env.docker .env.local

# código + configs necesarias para Tailwind/PostCSS
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./

# build
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone (incluye server.js)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# env en runtime (opcional, pero útil)
COPY --from=builder /app/.env.local ./.env.local

EXPOSE 3000
CMD ["node", "server.js"]