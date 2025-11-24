FROM node:22-alpine

WORKDIR /app

# 1. Installer OpenSSL (Indispensable pour Prisma sur Alpine)
RUN apk add --no-cache openssl

COPY package*.json ./

# 2. Installer les dépendances
RUN npm install

# 3. Copier le code (Le .dockerignore va filtrer les fichiers inutiles)
COPY . .

# 4. La solution ultime pour le build
# On définit une variable de construction (ARG)
# Prisma va la lire automatiquement sans qu'on ait besoin de la mettre dans la commande
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/mydb" > .env

# 5. Générer le client
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]