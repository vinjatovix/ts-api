# Usa la imagen base con Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación desde la carpeta /src
COPY ./ /app

# Instala las dependencias y realiza la construcción
RUN npm install && npm run build

# Copia los archivos compilados de la carpeta /dist
COPY ./dist /app/dist

# Expone el puerto en el que la aplicación va a ejecutarse
EXPOSE 3000
ENV PORT=3000

# Comando para iniciar la aplicación en modo de producción desde la carpeta /app
CMD ["node", "/app/dist/src/apps/apiApp/backend/start.js"]
