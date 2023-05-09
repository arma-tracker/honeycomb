FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
COPY . ./
EXPOSE 8080
CMD [ "node","dist/src/index.js" ]