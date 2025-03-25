FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY ./ /app

RUN npm run build


FROM node:22 AS production

WORKDIR /app

RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist/src/apps/apiApp/dependency-injection/*.yaml /app/dist/src/apps/apiApp/dependency-injection/

RUN chown -R appuser:appgroup /app

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

USER appuser

CMD ["node", "dist/src/apps/apiApp/start.js"]
