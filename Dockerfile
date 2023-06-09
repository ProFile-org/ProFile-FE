FROM node:18-alpine AS build

WORKDIR /app

ARG API_URL

ENV VITE_API_ENDPOINT=${API_URL:-http://localhost:8888/api/v1}

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:stable-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]