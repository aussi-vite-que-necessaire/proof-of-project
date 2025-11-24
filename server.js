const http = require("http")
const { Client } = require("pg")

// Configuration
const dbConfig = {
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "example",
  database: process.env.POSTGRES_DB || "myapp",
  host: "db",
  port: 5432,
}

let client

// Fonction de connexion résiliente (Retry Pattern)
const connectWithRetry = () => {
  console.log("⏳ Tentative de connexion à PostgreSQL...")

  // On crée une nouvelle instance à chaque tentative
  client = new Client(dbConfig)

  client
    .connect()
    .then(() => console.log("✅ Connecté à PostgreSQL avec succès !"))
    .catch((err) => {
      console.error(
        "❌ Échec connexion DB. Nouvelle tentative dans 5 secondes..."
      )
      console.error("Erreur:", err.message)
      // On attend 5 secondes avant de réessayer
      setTimeout(connectWithRetry, 5000)
    })
}

// Lancer la connexion
connectWithRetry()

const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")

  try {
    // Si le client n'est pas connecté, ça va planter ici, et c'est géré par le catch
    const result = await client.query("SELECT NOW() as now")
    const dbTime = result.rows[0].now

    res.end(
      `Hello from the VPS! \nEnvironment: ${process.env.NODE_ENV} \nDB Time: ${dbTime}`
    )
  } catch (e) {
    res.end(
      `L'API fonctionne, mais la DB n'est pas encore prête.\nErreur: ${e.message}`
    )
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
