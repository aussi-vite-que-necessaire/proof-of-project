FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste (y compris le dossier prisma)
COPY . .

# Génère le client Prisma (Le code JS pour parler à la DB)
RUN npx prisma generate

EXPOSE 3000

# LA COMMANDE MAGIQUE :
# 1. On applique les migrations (deploy mode)
# 2. SI ça marche (&&), on lance le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]