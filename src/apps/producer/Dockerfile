FROM node

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN npm install

COPY . .

RUN npm run build
CMD ["node", "dist/apps/producer/main.js"]