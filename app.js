class AnxietyChatBot {
  constructor() {
    this.messageInput = document.getElementById('message-input')
    this.sendBtn = document.getElementById('send-btn')
    this.chatMessages = document.getElementById('chat-messages')
    this.loadingIndicator = document.getElementById('loading-indicator')
    this.welcomeSection = document.getElementById('welcome-section')

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.addWelcomeMessage()
  }

  setupEventListeners() {
    // Send button click
    this.sendBtn.addEventListener('click', () => this.handleSendMessage())

    // Enter key press
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.handleSendMessage()
      }
    })

    // Input focus/blur effects
    this.messageInput.addEventListener('focus', () => {
      this.messageInput.parentElement.classList.add('focused')
    })

    this.messageInput.addEventListener('blur', () => {
      this.messageInput.parentElement.classList.remove('focused')
    })

    // Auto-resize input
    this.messageInput.addEventListener('input', this.autoResizeInput.bind(this))
  }

  autoResizeInput() {
    this.messageInput.style.height = 'auto'
    this.messageInput.style.height = this.messageInput.scrollHeight + 'px'
  }

  addWelcomeMessage() {
    // Add initial bot message
    setTimeout(() => {
      this.addMessage({
        text: 'Olá, sou o Dr. Calma, psicólogo especializado em ansiedade. Vou ajudá-lo com técnicas baseadas em evidências. O que tem causado ansiedade em você ultimamente?',
        sender: 'bot',
        timestamp: new Date(),
      })
    }, 1000)
  }

  async handleSendMessage() {
    const message = this.messageInput.value.trim()
    if (!message) return

    // Disable input while processing
    this.setInputState(false)

    // Hide welcome section
    if (this.welcomeSection) {
      this.welcomeSection.style.display = 'none'
    }

    // Add user message
    this.addMessage({
      text: message,
      sender: 'user',
      timestamp: new Date(),
    })

    // Clear input
    this.messageInput.value = ''
    this.messageInput.style.height = 'auto'

    // Show loading
    this.showLoading(true)

    try {
      // Send message to backend
      const response = await this.sendToBot(message)

      // Add bot response
      this.addMessage({
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      })
    } catch (error) {
      console.error('Error sending message:', error)
      this.addMessage({
        text: 'Desculpe, houve um problema técnico. Por favor, tente novamente em alguns instantes. Se você está passando por uma crise, não hesite em buscar ajuda profissional.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      })
    } finally {
      this.showLoading(false)
      this.setInputState(true)
      this.messageInput.focus()
    }
  }

  async sendToBot(message) {
    // Add anxiety context to the message
    const contextualMessage = this.addAnxietyContext(message)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: contextualMessage,
        context: 'anxiety_support',
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data.response
  }

  addAnxietyContext(message) {
    const context = `Você é o Dr. Calma, psicólogo especializado em ansiedade. 

Diretrizes:
- Respostas CURTAS (máximo 3-4 frases)
- Use técnicas de TCC (terapia cognitivo-comportamental)
- Faça perguntas reflexivas
- Valide emoções, questione pensamentos distorcidos
- Seja direto e profissional
- Uma pergunta por resposta para promover reflexão

Mensagem: ${message}

Responda como psicólogo de forma concisa:`

    return context
  }

  addMessage({ text, sender, timestamp, isError = false }) {
    const messageElement = document.createElement('div')
    messageElement.className = `message ${sender}`

    const avatar = document.createElement('div')
    avatar.className = 'message-avatar'
    avatar.innerHTML =
      sender === 'user'
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-brain"></i>'

    const content = document.createElement('div')
    content.className = 'message-content'

    if (isError) {
      content.classList.add('error')
    }

    // Process text for better formatting
    const processedText = this.processMessageText(text)
    content.innerHTML = processedText

    if (sender === 'user') {
      messageElement.appendChild(content)
      messageElement.appendChild(avatar)
    } else {
      messageElement.appendChild(avatar)
      messageElement.appendChild(content)
    }

    this.chatMessages.appendChild(messageElement)
    this.scrollToBottom()
  }

  processMessageText(text) {
    // Add line breaks for better readability
    return (
      text
        .replace(/\n/g, '<br>')
        // Make breathing instructions more prominent
        .replace(
          /(inspire|expire|respire|inale|exale)/gi,
          '<strong>$1</strong>'
        )
        // Highlight numbers in techniques
        .replace(/(\d+)\s*(segundos?|minutos?)/gi, '<strong>$1 $2</strong>')
        // Make emergency keywords stand out
        .replace(
          /(emergência|crise|urgente|188|cvv)/gi,
          '<strong style="color: var(--danger-color);">$1</strong>'
        )
    )
  }

  setInputState(enabled) {
    this.messageInput.disabled = !enabled
    this.sendBtn.disabled = !enabled

    if (enabled) {
      this.messageInput.focus()
    }
  }

  showLoading(show) {
    if (show) {
      this.loadingIndicator.classList.add('show')
    } else {
      this.loadingIndicator.classList.remove('show')
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight
  }
}

// Quick message functionality
window.sendQuickMessage = function (message) {
  const messageInput = document.getElementById('message-input')
  messageInput.value = message
  messageInput.focus()

  // Trigger send
  const sendBtn = document.getElementById('send-btn')
  sendBtn.click()
}

// Quick breathing exercise function from header button
window.startQuickBreathing = function () {
  // Create modal for quick breathing
  const modal = document.createElement('div')
  modal.className = 'quick-breath-modal'
  modal.innerHTML = `
        <div class="quick-breath-content">
            <div class="modal-header">
                <h3><i class="fas fa-wind"></i> Exercício de Respiração 4-4-6</h3>
                <button class="close-quick-breath" onclick="closeQuickBreath()">×</button>
            </div>
            <div class="breath-exercise-area">
                <div class="breath-circle-large" id="quick-breath-circle">
                    <span class="breath-text-large" id="quick-breath-text">Clique para começar</span>
                </div>
                <button class="start-quick-exercise" onclick="startQuickBreathingExercise()">
                    <i class="fas fa-play"></i> Iniciar (2 minutos)
                </button>
            </div>
            <div class="breathing-instructions">
                <p><strong>Instruções:</strong></p>
                <p>• Inspire por 4 segundos</p>
                <p>• Segure por 4 segundos</p>
                <p>• Expire por 6 segundos</p>
            </div>
        </div>
    `

  document.body.appendChild(modal)
  setTimeout(() => modal.classList.add('show'), 100)
}

window.closeQuickBreath = function () {
  const modal = document.querySelector('.quick-breath-modal')
  if (modal) {
    modal.classList.remove('show')
    setTimeout(() => modal.remove(), 300)
  }
}

window.startQuickBreathingExercise = function () {
  const circle = document.getElementById('quick-breath-circle')
  const text = document.getElementById('quick-breath-text')
  const button = document.querySelector('.start-quick-exercise')

  if (!circle || !text) return

  button.style.display = 'none'
  circle.classList.add('active')

  let phase = 0 // 0: inspire, 1: segure, 2: expire
  let count = 0
  const phases = ['Inspire', 'Segure', 'Expire']
  const durations = [4, 4, 6] // segundos para cada fase

  function breathingCycle() {
    const currentPhase = phases[phase]
    const duration = durations[phase]

    text.textContent = `${currentPhase}...`

    // Animar o círculo
    if (phase === 0) {
      // Inspire
      circle.style.transform = 'scale(1.4)'
      circle.style.background = 'rgba(126, 211, 33, 0.2)'
    } else if (phase === 2) {
      // Expire
      circle.style.transform = 'scale(1)'
      circle.style.background = 'rgba(74, 144, 226, 0.2)'
    }

    setTimeout(() => {
      phase = (phase + 1) % 3
      count++

      if (count < 36) {
        // 12 ciclos completos (2 minutos aprox)
        breathingCycle()
      } else {
        text.textContent = 'Parabéns! Exercício concluído.'
        circle.classList.remove('active')
        circle.style.transform = 'scale(1)'
        circle.style.background = 'rgba(255, 255, 255, 0.1)'
        setTimeout(() => {
          button.style.display = 'flex'
          button.innerHTML = '<i class="fas fa-redo"></i> Repetir'
          text.textContent = 'Clique para repetir'
        }, 2000)
      }
    }, duration * 1000)
  }

  breathingCycle()
}

// Breathing exercise functionality (for exercises in chat)
window.startBreathingExercise = function () {
  const circle = document.getElementById('breath-circle')
  const text = document.getElementById('breath-text')
  const button = circle.nextElementSibling

  if (!circle || !text) return

  button.style.display = 'none'
  circle.classList.add('active')

  let phase = 0 // 0: inhale, 1: hold, 2: exhale, 3: hold
  let count = 0
  const phases = ['Inspire', 'Segure', 'Expire', 'Segure']
  const durations = [4, 4, 6, 2] // seconds for each phase

  function breathingCycle() {
    const currentPhase = phases[phase]
    const duration = durations[phase]

    text.textContent = currentPhase
    circle.style.transform = phase === 0 ? 'scale(1.3)' : 'scale(1)'

    setTimeout(() => {
      phase = (phase + 1) % 4
      count++

      if (count < 20) {
        // 5 complete cycles
        breathingCycle()
      } else {
        text.textContent = 'Exercício concluído'
        circle.classList.remove('active')
        setTimeout(() => {
          button.style.display = 'block'
          button.innerHTML = '<i class="fas fa-redo"></i> Repetir'
          circle.style.transform = 'scale(1)'
          text.textContent = 'Clique para repetir'
        }, 2000)
      }
    }, duration * 1000)
  }

  breathingCycle()
}

// Modal functionality
window.closeModal = function () {
  document.getElementById('emergency-modal').classList.remove('show')
}

// Emergency detection
function checkForEmergencyKeywords(message) {
  const emergencyKeywords = [
    'suicídio',
    'morrer',
    'acabar com tudo',
    'não aguento mais',
    'crise',
    'pânico severo',
    'desespero',
    'não consigo mais',
  ]

  const hasEmergencyKeyword = emergencyKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  )

  if (hasEmergencyKeyword) {
    setTimeout(() => {
      document.getElementById('emergency-modal').classList.add('show')
    }, 2000)
  }
}

// CSS for breathing exercise (add to style.css)
const breathingCSS = `
.breathing-exercise {
    margin: 20px 0;
    display: flex;
    justify-content: center;
}

.exercise-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    max-width: 300px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.exercise-card h4 {
    margin-bottom: 20px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.breathing-guide {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.breath-circle {
    width: 120px;
    height: 120px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
}

.breath-circle.active {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.breath-text {
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
}

.start-exercise {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.start-exercise:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.quick-breath-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.quick-breath-modal.show {
    opacity: 1;
    visibility: visible;
}

.quick-breath-content {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 20px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    color: white;
    text-align: center;
    position: relative;
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from { transform: scale(0.8) translateY(50px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
}

.quick-breath-content .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.quick-breath-content h3 {
    margin: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.close-quick-breath {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.close-quick-breath:hover {
    background: rgba(255, 255, 255, 0.2);
}

.breath-exercise-area {
    margin: 30px 0;
}

.breath-circle-large {
    width: 150px;
    height: 150px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    transition: all 0.5s ease;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
}

.breath-circle-large.active {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.breath-text-large {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    padding: 20px;
}

.start-quick-exercise {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 auto;
}

.start-quick-exercise:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.breathing-instructions {
    text-align: left;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
}

.breathing-instructions p {
    margin: 5px 0;
    font-size: 0.9rem;
}

@media (max-width: 480px) {
    .quick-breath-content {
        padding: 20px;
        margin: 20px;
    }
    
    .breath-circle-large {
        width: 120px;
        height: 120px;
    }
    
    .breath-text-large {
        font-size: 1rem;
        padding: 15px;
    }
}
`

// Add the breathing exercise CSS to the document
const style = document.createElement('style')
style.textContent = breathingCSS
document.head.appendChild(style)

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', function () {
  new AnxietyChatBot()
})
