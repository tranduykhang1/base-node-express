FROM node:21-slim AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

FROM base AS dev

COPY package*.json ./

COPY . .
