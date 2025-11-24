FROM node:22-alpine

WORKDIR /app

# 1. Installer OpenSSL (Indispensable pour Prisma sur Alpine)
RUN apk add --no-cache openssl

COPY package*.json ./

# 2. Installer les dépendances
RUN npm install

# 3. Copier le code (Le .dockerignore va filtrer les fichiers inutiles)
COPY . .

# 4. Définir DATABASE_URL pour Prisma generate (pas besoin de vraie DB pour générer le client)
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/mydb

# 5. Générer le client
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]