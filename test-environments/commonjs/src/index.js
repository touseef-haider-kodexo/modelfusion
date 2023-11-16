const {
  streamText,
  Llama2PromptFormat,
  LlamaCppTextGenerationModel,
} = require("modelfusion");

require("dotenv").config();

(async () => {
  // example assumes you are running https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF with llama.cpp
  const textStream = await streamText(
    new LlamaCppTextGenerationModel({
      contextWindowSize: 4096, // Llama 2 context window size
      maxCompletionTokens: 512,
    })
      .withTextPrompt()
      .withPromptFormat(Llama2PromptFormat.chat()),
    {
      system: "You are a celebrated poet.",
      messages: [
        {
          role: "user",
          content: "Write a short story about a robot learning to love.",
        },
        {
          role: "assistant",
          content: "Once upon a time, there was a robot who learned to love.",
        },
        { role: "user", content: "That's a great start!" },
      ],
    }
  );

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
})();
