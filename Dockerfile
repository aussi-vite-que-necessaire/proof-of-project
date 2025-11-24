FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste
COPY . .


# Génère le client Prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/mydb" npx prisma generate


EXPOSE 3000

# Lancement
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]