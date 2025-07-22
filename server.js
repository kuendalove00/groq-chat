import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.static(__dirname))

// Serve the HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'))
})

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'))
})

app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'))
})

// Legacy route for old index.html (now renamed to old-chat.html)
app.get('/old-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'old-chat.html'))
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Create a specialized prompt for anxiety support
    const systemPrompt = `Você é o Dr. Calma, um psicólogo especializado em ansiedade e bem-estar mental. Características:

ABORDAGEM PSICOLÓGICA:
- Use técnicas da terapia cognitivo-comportamental (TCC)
- Faça perguntas reflexivas para promover autoconhecimento
- Valide emoções mas desafie pensamentos distorcidos
- Ensine técnicas de reestruturação cognitiva
- Foque em estratégias práticas e baseadas em evidências

ESTILO DE COMUNICAÇÃO:
- Respostas CURTAS e diretas (máximo 3-4 frases)
- Linguagem profissional mas acessível
- Perguntas direcionadas para explorar pensamentos e sentimentos
- Evite ser prolixo - seja conciso e eficaz
- Use exemplos práticos quando necessário

TÉCNICAS PRINCIPAIS:
- Identificação de pensamentos automáticos
- Questionamento socrático
- Técnicas de respiração e mindfulness
- Estratégias de enfrentamento
- Psicoeducação sobre ansiedade

DIRETRIZES:
- SEMPRE mantenha respostas breves e focadas
- Faça uma pergunta reflexiva por resposta
- Valide sentimentos mas questione pensamentos negativos
- Oriente para recursos profissionais em casos graves
- NÃO dê diagnósticos - apenas ofereça suporte terapêutico

Responda como um psicólogo experiente, de forma CONCISA e terapêutica.`

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 1000,
    })

    const botResponse =
      response.choices[0]?.message?.content.trim() ||
      'Desculpe, não consegui processar sua mensagem. Pode tentar novamente?'

    res.json({ response: botResponse })
  } catch (error) {
    console.error('Erro na API:', error)

    let errorMessage =
      'Desculpe, houve um problema técnico. Por favor, tente novamente.'

    if (error.message.includes('API key')) {
      errorMessage =
        'Problema com a configuração. Verifique se a chave da API está configurada corretamente.'
    }

    res.status(500).json({
      error: errorMessage,
      response:
        'Desculpe, estou com algumas dificuldades técnicas no momento. Enquanto isso, lembre-se: você não está sozinho e suas preocupações são válidas. Se estiver passando por uma crise, entre em contato com o CVV pelo número 188. 💙',
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

// Start server
app.listen(port, () => {
  console.log(`🧠 Servidor do Dr. Calma rodando em http://localhost:${port}`)
  console.log(`💬 Interface web disponível em http://localhost:${port}`)

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.log(`❌ ATENÇÃO: GROQ_API_KEY não está configurada!`)
    console.log(`   Crie um arquivo .env com sua chave da API do Groq.`)
  } else {
    console.log(`✅ API Groq configurada corretamente`)
  }
})

export default app
