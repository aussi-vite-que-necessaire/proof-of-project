FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste
COPY . .

# --- LE FIX EST ICI ---
# On définit une URL bidon juste pour que Prisma accepte de générer le client.
# Cette valeur sera écrasée par la vraie URL au démarrage du conteneur.
ENV DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb"

# Génère le client Prisma
RUN npx prisma generate

EXPOSE 3000

# Lancement
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]