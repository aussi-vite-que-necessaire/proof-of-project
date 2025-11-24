module.exports = {
  // On indique à Prisma où trouver la variable d'environnement
  datasource: {
    url: process.env.DATABASE_URL,
  },
}
