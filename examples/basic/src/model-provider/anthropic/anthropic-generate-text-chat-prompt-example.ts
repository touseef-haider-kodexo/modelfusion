import dotenv from "dotenv";
import { AnthropicTextGenerationModel, generateText } from "modelfusion";

dotenv.config();

async function main() {
  const text = await generateText(
    new AnthropicTextGenerationModel({
      model: "claude-instant-1",
      temperature: 0.7,
      maxCompletionTokens: 500,
    }).withChatPrompt(),
    {
      // note: Anthropic models don't adhere well to the system message, we leave it out
      messages: [
        {
          role: "user",
          content: "Suggest a name for a robot.",
        },
        {
          role: "assistant",
          content: "I suggest the name Robbie",
        },
        {
          role: "user",
          content: "Write a short story about Robbie learning to love",
        },
      ],
    }
  );

  console.log(text);
}

main().catch(console.error);
