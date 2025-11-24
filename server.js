const http = require("http")
const { Client } = require("pg")

// Configuration de la DB via les variables d'environnement (Injectées par Docker)
const client = new Client({
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "example",
  database: process.env.POSTGRES_DB || "myapp",
  host: "db", // <--- C'est le nom du service dans docker-compose !
  port: 5432,
})

// Connexion à la DB
client
  .connect()
  .then(() => console.log("✅ Connecté à PostgreSQL"))
  .catch((err) => console.error("❌ Erreur connexion DB", err))

const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")

  try {
    // Petit test : Demander l'heure à la DB
    const result = await client.query("SELECT NOW() as now")
    const dbTime = result.rows[0].now

    res.end(
      `Hello from VPS! \nEnvironment: ${process.env.NODE_ENV} \nDB Time: ${dbTime}`
    )
  } catch (e) {
    res.end(`Erreur DB: ${e.message}`)
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
