# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "3000"]
