# 🧠 Dr. Calma - Psicólogo Especializado em Ansiedade

O **Dr. Calma** é um chatbot que simula um psicólogo especializado em ansiedade, usando técnicas da Terapia Cognitivo-Comportamental (TCC). Oferece respostas concisas e direcionadas, com foco em autoconhecimento e estratégias práticas.

![Calma Interface](https://img.shields.io/badge/Interface-Web%20%2B%20CLI-blue)
![Powered by Groq](https://img.shields.io/badge/Powered%20by-Groq-green)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)

## ✨ Funcionalidades

### 🧠 Abordagem Psicológica

- Técnicas de Terapia Cognitivo-Comportamental (TCC)
- Perguntas reflexivas para promover autoconhecimento
- Identificação de pensamentos automáticos
- Questionamento socrático
- Respostas curtas e diretas (máximo 3-4 frases)

### 🎯 Especialidades Clínicas

- **Reestruturação Cognitiva**: Identificar e questionar pensamentos distorcidos
- **Manejo da Ansiedade**: Estratégias baseadas em evidências
- **Técnicas de Relaxamento**: Respiração e mindfulness
- **Identificação de Gatilhos**: Mapeamento de situações ansiogênicas
- **Psicoeducação**: Compreensão dos mecanismos da ansiedade

### � Funcionalidades Técnicas

- Interface web responsiva
- Versão CLI para terminal
- Exercícios de respiração interativos
- Detecção de situações de emergência
- Links para recursos de ajuda profissional

## 🚀 Como Usar

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Configuração da API

Crie um arquivo `.env` na raiz do projeto:

```env
GROQ_API_KEY=sua_chave_api_aqui
```

Para obter sua chave da API:

1. Visite [console.groq.com](https://console.groq.com)
2. Crie uma conta ou faça login
3. Gere uma nova chave de API
4. Copie e cole no arquivo `.env`

### 3. Iniciando a Interface Web

```bash
npm start
```

Acesse: `http://localhost:3000`

### 4. Usando a Versão CLI (Terminal)

```bash
npm run cli
```

## 🎯 Exemplos de Interação

### Abordagem Terapêutica

- **Usuário**: "Estou sempre ansioso no trabalho"
- **Dr. Calma**: "Que pensamentos específicos passam pela sua cabeça quando está no trabalho? Eles são baseados em fatos ou em suposições?"

### Técnicas Práticas

- **Usuário**: "Tenho ataques de pânico"
- **Dr. Calma**: "Vamos focar na respiração 4-4-6: inspire por 4, segure por 4, expire por 6. Quais sensações físicas você nota primeiro quando começa a se sentir ansioso?"

## �️ Estrutura do Projeto

```
groq-chat/
├── index.html          # Interface web
├── style.css           # Estilos da interface
├── app.js              # JavaScript da interface
├── server.js           # Servidor web
├── chat.js             # Versão CLI
├── package.json        # Dependências
├── .env                # Chave da API
└── README.md           # Documentação
```

## ⚠️ Importante

**O Dr. Calma é uma ferramenta de apoio baseada em técnicas psicológicas estabelecidas, mas não substitui atendimento psicológico profissional. Para questões graves ou persistentes, procure um psicólogo licenciado.**

## � Recursos de Emergência

- **CVV**: 188 ou [cvv.org.br](https://cvv.org.br)
- **CAPS**: Procure a unidade mais próxima
- **Emergência**: 192 (SAMU) ou 193 (Bombeiros)

---

🧠 **Desenvolvido com base em técnicas de Terapia Cognitivo-Comportamental**
