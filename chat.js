import Groq from "groq-sdk";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askUser(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function chatLoop() {
  console.log("💬 O chat iniciou — digite 'sair' para terminar a conversa.\n");

  while (true) {
    const userInput = await askUser("Você: ");

    if (userInput.toLowerCase() === "sair") {
      console.log("👋 Até logo.");
      rl.close();
      break;
    }

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: userInput,
          },
        ],
        model: "llama3-70b-8192",
      });

      console.log("\nO Chat:", response.choices[0]?.message?.content.trim() || "Sem Resposta", "\n");
    } catch (err) {
      console.error("❌ Erro:", err.message);
    }
  }
}

chatLoop();
