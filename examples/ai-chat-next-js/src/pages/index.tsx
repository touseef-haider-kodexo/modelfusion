import { ChatMessage } from "@/component/ChatMessage";
import { ChatMessageInput } from "@/component/ChatMessageInput";
import { createOpenAIChatCompletionDeltaStream } from "@lgrammel/ai-utils/provider/openai";
import { convertReadableStreamToAsyncIterator } from "@lgrammel/ai-utils/util";
import { Box } from "@mui/material";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{
      role: "assistant" | "user";
      content: string;
    }>
  >([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSend = async (message: string) => {
    try {
      const userMessage = { role: "user" as const, content: message };
      const messagesToSend = [...messages, userMessage];

      setIsSending(true);
      setMessages([
        ...messagesToSend,
        {
          role: "assistant",
          content: "...",
        },
      ]);

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
      });

      const completionDeltaStream = await createOpenAIChatCompletionDeltaStream(
        convertReadableStreamToAsyncIterator(response.body!.getReader())
      );

      for await (const completionDelta of completionDeltaStream) {
        if (completionDelta == null) {
          continue;
        }

        if (completionDelta.type === "error") {
          console.error(completionDelta.error);
          continue;
        }

        const delta = completionDelta.delta[0];

        setMessages((currentMessages) => {
          return [
            ...currentMessages.slice(0, currentMessages.length - 1),
            {
              role: delta.role ?? "assistant",
              content: delta.content,
            },
          ];
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>@lgrammel/ai-utils chat example</title>
      </Head>
      <Box sx={{ height: "100%", overflowY: "auto", marginTop: 4 }}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </Box>

      <ChatMessageInput disabled={isSending} onSend={handleSend} />
    </>
  );
}