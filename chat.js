import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askUser(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer)
    })
  })
}

async function chatLoop() {
  console.log(
    "🧠 Dr. Calma - Psicólogo especializado em ansiedade — digite 'sair' para terminar.\n"
  )

  while (true) {
    const userInput = await askUser('Você: ')

    if (userInput.toLowerCase() === 'sair') {
      console.log(
        '👋 Cuide-se bem. Lembre-se: buscar ajuda é um sinal de força.'
      )
      rl.close()
      break
    }

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'Você é o Dr. Calma, psicólogo especializado em ansiedade. Responda de forma CONCISA (máximo 3-4 frases), use técnicas de TCC, faça perguntas reflexivas e seja direto mas empático.',
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 200,
      })

      console.log(
        '\nDr. Calma:',
        response.choices[0]?.message?.content.trim() ||
          'Pode repetir sua pergunta?',
        '\n'
      )
    } catch (err) {
      console.error('❌ Erro:', err.message)
    }
  }
}

chatLoop()
