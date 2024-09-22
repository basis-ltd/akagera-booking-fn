FROM node:lts

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG VITE_APP_STAGING_API_URL
ARG VITE_APP_PRODUCTION_API_URL

ENV VITE_APP_STAGING_API_URL=$VITE_APP_STAGING_API_URL
ENV VITE_APP_PRODUCTION_API_URL=$VITE_APP_PRODUCTION_API_URL

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "-l", "3000", "build"]