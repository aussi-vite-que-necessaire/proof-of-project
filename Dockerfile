FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# 1. Installer les dépendances
RUN npm install

# 2. Copier le code
COPY . .

EXPOSE 3000

# 3. Drizzle n'a pas besoin de génération de client, c'est direct !
CMD ["node", "server.js"]