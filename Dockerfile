FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm ci

WORKDIR /app/common
RUN npm run build-linux



FROM build as build-client
WORKDIR /app/client
RUN npm run build

FROM nginx:alpine AS client
COPY nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=build-client /app/client/build .



FROM build as build-server
WORKDIR /app/server
ENV NODE_ENV production
RUN npm run compile
WORKDIR /app
RUN rm -rf /app/client
RUN npm prune --production

FROM node:alpine AS server
WORKDIR /app
COPY --from=build-server /app/node_modules ./node_modules
WORKDIR /app/server
COPY --from=build-server /app/server/dist ./dist
COPY --from=build-server /app/server/data ./data
COPY --from=build-server /app/server/assets ./assets
ARG DEFAULT_PORT=4000
ENV PORT ${DEFAULT_PORT}
EXPOSE ${PORT}
CMD ["node", "./dist/app"]