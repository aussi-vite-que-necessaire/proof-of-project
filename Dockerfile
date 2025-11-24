FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Pas de npm install car pas de package.json pour cette démo simple, 
# mais normalement tu le mettrais ici.
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]