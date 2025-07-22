const express = require('express')
const path = require('path')
const app = express()
const port = 3000

// Serve static files
app.use(express.static(__dirname))

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'))
})

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'))
})

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  console.log(`📄 Landing page: http://localhost:${port}`)
  console.log(`💬 Chat: http://localhost:${port}/chat`)
})
