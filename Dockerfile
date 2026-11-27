FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

COPY . ./

EXPOSE 3010

CMD ["node", "server.js"]
