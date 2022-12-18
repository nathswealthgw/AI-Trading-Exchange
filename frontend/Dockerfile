FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts index.html /app/
COPY src /app/src
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
