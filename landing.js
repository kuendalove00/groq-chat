// Landing Page JavaScript for Dr. Calma

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling
  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const targetId = this.getAttribute('href')
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  })

  // Hero buttons smooth scroll
  const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]')
  heroButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault()
      const targetId = this.getAttribute('href')
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  })

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar')
  let lastScrollY = window.scrollY

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)'
      navbar.style.backdropFilter = 'blur(20px)'
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)'
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)'
      navbar.style.backdropFilter = 'blur(10px)'
      navbar.style.boxShadow = 'none'
    }

    lastScrollY = currentScrollY
  })

  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.querySelector('.nav-menu')

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active')
      navToggle.classList.toggle('active')
    })
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.feature-card, .benefit-item, .testimonial-card, .info-card'
  )
  animateElements.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = 'all 0.6s ease'
    observer.observe(el)
  })

  // Floating chat button animation
  const floatingChat = document.getElementById('floating-chat')
  if (floatingChat) {
    // Show floating button after user scrolls past hero
    window.addEventListener('scroll', function () {
      const heroSection = document.querySelector('.hero')
      const heroHeight = heroSection ? heroSection.offsetHeight : 0

      if (window.scrollY > heroHeight * 0.7) {
        floatingChat.style.opacity = '1'
        floatingChat.style.transform = 'scale(1)'
      } else {
        floatingChat.style.opacity = '0'
        floatingChat.style.transform = 'scale(0.8)'
      }
    })

    // Initial state
    floatingChat.style.opacity = '0'
    floatingChat.style.transform = 'scale(0.8)'
    floatingChat.style.transition = 'all 0.3s ease'

    // Add click handler for debugging
    const chatBtn = floatingChat.querySelector('.chat-btn, a')
    if (chatBtn) {
      chatBtn.addEventListener('click', function (e) {
        console.log('Botão do chat clicado! Redirecionando para:', this.href)

        // Check if server is running by trying to fetch the chat page
        fetch('/chat')
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`)
            }
            console.log('Servidor está funcionando, carregando chat...')
            // If fetch succeeds, allow the navigation
            window.location.href = '/chat'
          })
          .catch((error) => {
            console.error('Erro ao acessar o chat:', error)
            e.preventDefault() // Prevent default navigation

            // Show user-friendly error message
            const notification = document.createElement('div')
            notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: linear-gradient(135deg, #ff6b6b, #ee5a52);
              color: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              z-index: 10000;
              max-width: 350px;
              font-family: 'Inter', sans-serif;
              animation: slideInRight 0.3s ease;
            `

            notification.innerHTML = `
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; margin-top: 2px;"></i>
                <div>
                  <strong style="display: block; margin-bottom: 8px;">Servidor não está rodando!</strong>
                  <p style="margin: 0 0 15px 0; font-size: 0.9rem; line-height: 1.4;">
                    Para acessar o chatbot do Dr. Calma, você precisa iniciar o servidor:
                  </p>
                  <ol style="margin: 0 0 15px 0; padding-left: 20px; font-size: 0.9rem;">
                    <li>Abra o terminal/prompt de comando</li>
                    <li>Execute: <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">node server.js</code></li>
                    <li>Clique novamente no botão do chat</li>
                  </ol>
                  <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                          style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                    Fechar
                  </button>
                </div>
              </div>
            `

            document.body.appendChild(notification)

            // Auto remove after 10 seconds
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove()
              }
            }, 10000)
          })
      })
    }
  }

  // Counter animation for benefits section
  const counters = document.querySelectorAll('.benefit-stat')
  const animateCounters = function () {
    counters.forEach((counter) => {
      const target = counter.textContent
      const isPercent = target.includes('%')
      const isMultiplier = target.includes('x')
      const isHours = target.includes('h')
      const isInfinity = target.includes('∞')

      if (isInfinity) return // Skip infinity symbol

      let numericTarget
      if (isPercent) {
        numericTarget = parseInt(target.replace('%', ''))
      } else if (isMultiplier) {
        numericTarget = parseInt(target.replace('x', ''))
      } else if (isHours) {
        numericTarget = parseInt(target.replace('h', ''))
      } else {
        numericTarget = parseInt(target) || 0
      }

      if (numericTarget > 0) {
        let current = 0
        const increment = numericTarget / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= numericTarget) {
            current = numericTarget
            clearInterval(timer)
          }

          let displayValue = Math.floor(current)
          if (isPercent) displayValue += '%'
          if (isMultiplier) displayValue += 'x'
          if (isHours) displayValue += 'h'

          counter.textContent = displayValue
        }, 30)
      }
    })
  }

  // Trigger counter animation when benefits section is in view
  const benefitsSection = document.querySelector('.benefits')
  if (benefitsSection) {
    const benefitsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters()
            benefitsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    benefitsObserver.observe(benefitsSection)
  }

  // Add loading animation for feature images
  const featureCards = document.querySelectorAll('.feature-card')
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
  })

  // Parallax effect for hero section
  const heroVisual = document.querySelector('.hero-visual')
  if (heroVisual) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5
      heroVisual.style.transform = `translateY(${rate}px)`
    })
  }
})

// Quick breathing exercise modal (keeping existing functionality)
window.showQuickBreathing = function () {
  const modal = document.getElementById('breathing-modal')
  if (modal) {
    modal.classList.add('show')

    // Reset modal state
    const circle = document.getElementById('breath-circle-landing')
    const text = document.getElementById('breath-text-landing')
    const button = document.querySelector('.start-breathing-btn')

    if (circle && text && button) {
      circle.classList.remove('active')
      circle.style.transform = 'scale(1)'
      circle.style.background = 'rgba(255, 255, 255, 0.1)'
      text.textContent = 'Pronto para começar?'
      button.style.display = 'flex'
      button.innerHTML = '<i class="fas fa-play"></i> Iniciar Respiração'
    }
  }
}

window.closeQuickBreathing = function () {
  const modal = document.getElementById('breathing-modal')
  if (modal) {
    modal.classList.remove('show')
  }
}

window.startBreathingLanding = function () {
  const circle = document.getElementById('breath-circle-landing')
  const text = document.getElementById('breath-text-landing')
  const button = document.querySelector('.start-breathing-btn')

  if (!circle || !text) return

  button.style.display = 'none'
  circle.classList.add('active')

  let phase = 0 // 0: inspire, 1: segure, 2: expire
  let count = 0
  const phases = ['Inspire', 'Segure', 'Expire']
  const durations = [4, 4, 6] // segundos para cada fase
  const totalCycles = 30 // 10 ciclos completos (2 minutos)

  function breathingCycle() {
    const currentPhase = phases[phase]
    const duration = durations[phase]

    text.textContent = `${currentPhase}...`

    // Animar o círculo
    if (phase === 0) {
      // Inspire
      circle.style.transform = 'scale(1.3)'
      circle.style.background = 'rgba(126, 211, 33, 0.2)'
    } else if (phase === 1) {
      // Segure
      circle.style.transform = 'scale(1.3)'
      circle.style.background = 'rgba(255, 193, 7, 0.2)'
    } else if (phase === 2) {
      // Expire
      circle.style.transform = 'scale(1)'
      circle.style.background = 'rgba(74, 144, 226, 0.2)'
    }

    setTimeout(() => {
      phase = (phase + 1) % 3
      count++

      if (count < totalCycles) {
        breathingCycle()
      } else {
        // Exercício concluído
        text.textContent = '🎉 Parabéns! Como se sente?'
        circle.classList.remove('active')
        circle.style.transform = 'scale(1)'
        circle.style.background = 'rgba(255, 255, 255, 0.1)'

        setTimeout(() => {
          button.style.display = 'flex'
          button.innerHTML = '<i class="fas fa-redo"></i> Repetir Exercício'
          text.textContent = 'Exercício concluído com sucesso!'

          // Show completion message
          showCompletionMessage()
        }, 3000)
      }
    }, duration * 1000)
  }

  // Show initial countdown
  let countdown = 3
  const countdownInterval = setInterval(() => {
    text.textContent = `Começando em ${countdown}...`
    countdown--

    if (countdown < 0) {
      clearInterval(countdownInterval)
      breathingCycle()
    }
  }, 1000)
}

function showCompletionMessage() {
  const modal = document.querySelector('.breathing-modal-content')
  const completionBanner = document.createElement('div')
  completionBanner.className = 'completion-banner'
  completionBanner.innerHTML = `
        <div class="completion-content">
            <i class="fas fa-check-circle"></i>
            <p>Excelente! Você completou um exercício de respiração que pode reduzir significativamente os níveis de ansiedade.</p>
            <div class="completion-actions">
                <a href="chat.html" class="completion-btn">
                    <i class="fas fa-comments"></i>
                    Conversar com Dr. Calma
                </a>
            </div>
        </div>
    `

  modal.appendChild(completionBanner)

  // Auto remove after 10 seconds
  setTimeout(() => {
    if (completionBanner.parentNode) {
      completionBanner.remove()
    }
  }, 10000)
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
  const modal = document.getElementById('breathing-modal')
  if (event.target === modal) {
    closeQuickBreathing()
  }
})

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeQuickBreathing()
  }
})

// Add CSS for completion banner and animations
const additionalCSS = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.completion-banner {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 20px;
    border-radius: 0 0 20px 20px;
    text-align: center;
    animation: slideInFromBottom 0.5s ease;
    z-index: 10;
}

@keyframes slideInFromBottom {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.completion-content i {
    font-size: 2rem;
    margin-bottom: 15px;
    display: block;
}

.completion-content p {
    margin-bottom: 20px;
    line-height: 1.6;
}

.completion-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.completion-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

/* Animation classes */
.feature-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.feature-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.floating-card {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.8s ease;
}

.floating-card.animate-in {
    opacity: 1;
    transform: scale(1);
}

/* Add staggered animation delay */
.feature-card:nth-child(1) { transition-delay: 0s; }
.feature-card:nth-child(2) { transition-delay: 0.1s; }
.feature-card:nth-child(3) { transition-delay: 0.2s; }
.feature-card:nth-child(4) { transition-delay: 0.3s; }
.feature-card:nth-child(5) { transition-delay: 0.4s; }
.feature-card:nth-child(6) { transition-delay: 0.5s; }
`

// Add the additional CSS to the document
const style = document.createElement('style')
style.textContent = additionalCSS
document.head.appendChild(style)

// Console welcome message
console.log(`
🧠 Dr. Calma - Psicólogo Digital
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bem-vindo à landing page do Dr. Calma!

Funcionalidades disponíveis:
• Exercício de respiração interativo
• Navegação suave entre seções
• Design responsivo e acessível
• Integração com chat do psicólogo

Para começar uma conversa, clique em "Iniciar Conversa"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

// Analytics tracking (if needed)
function trackUserInteraction(action, element) {
  console.log(`User interaction: ${action} on ${element}`)
  // Here you could integrate with Google Analytics or other tracking services
}

// Track button clicks
document.addEventListener('click', function (event) {
  if (event.target.matches('.btn, button, a')) {
    const elementText = event.target.textContent.trim()
    trackUserInteraction('click', elementText)
  }
})

// Performance monitoring
window.addEventListener('load', function () {
  const loadTime = performance.now()
  console.log(`⚡ Landing page loaded in ${Math.round(loadTime)}ms`)
})
