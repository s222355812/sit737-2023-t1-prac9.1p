FROM node:14-slim
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY server.js .
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl --fail http://localhost:8000/health || exit 1
CMD ["node","server.js"]

