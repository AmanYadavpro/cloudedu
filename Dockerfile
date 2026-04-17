FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Move index.html to public folder so Express can serve it
RUN mkdir -p public && mv index.html public/

EXPOSE 3000

CMD ["node", "server.js"]