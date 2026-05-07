FROM node

WORKDIR /app
RUN npm install -g yarn

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build
CMD ["node", "dist/apps/consumer/main.js"]