import Groq from "groq-sdk";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askUser(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    const userInput = await askUser("🧠 Perguntar ao Groq: ");
    const response = await getGroqChatCompletion(userInput);
    console.log("\n📝 O Groq diz:\n", response.choices[0]?.message?.content || "Sem Resposta");
  } catch (err) {
    console.error("❌ Erro:", err);
  } finally {
    rl.close();
  }
}

async function getGroqChatCompletion(userText) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userText,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

main();
