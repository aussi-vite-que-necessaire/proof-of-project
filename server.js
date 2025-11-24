const http = require("http")

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")
  res.end(
    `Hello from the VPS depuis la PR! Environment: ${process.env.NODE_ENV}`
  )
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
