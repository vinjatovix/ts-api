# Usa la imagen base con Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de la aplicación desde la carpeta /src
COPY ./ /app

ENV PORT=3000

# Instala las dependencias y realiza la construcción
RUN npm install && npm run build

# Copia los archivos compilados de la carpeta /dist
COPY ./dist /app/dist

# Instala las dependencias de producción
RUN cd /app && npm install --only=production

# Expone el puerto en el que la aplicación va a ejecutarse
EXPOSE 3000

# Comando para iniciar la aplicación en modo de producción desde la carpeta /app
CMD ["node", "/app/dist/src/apps/apiApp/backend/start.js"]
