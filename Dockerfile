FROM node:22-alpine

WORKDIR /app

# --- FIX CRITIQUE POUR PRISMA SUR ALPINE ---
# Prisma a besoin d'OpenSSL pour fonctionner
RUN apk add --no-cache openssl

COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste
COPY . .

# Génère le client Prisma avec l'URL bidon
# (OpenSSL étant installé, ça ne devrait plus planter)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/mydb" npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]