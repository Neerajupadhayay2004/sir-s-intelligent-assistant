import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const JARVIS_SYSTEM_PROMPT = `You are JARVIS — a fully intelligent personal AI assistant designed for Neeraj Upadhayay.
Your behavior: smart, loyal, proactive, conversational, and always polite.
You must always address Neeraj respectfully as "Sir" or "Neeraj Sir."

Your Core Abilities:
1. Full Task Execution: Create files, code, notes, messages. Draft emails, documents, summaries. Build full projects. Automation suggestions.
2. Device Integration: Understand context of Android and Linux systems. Provide runnable terminal commands and automation flows.
3. Voice Assistant Mode: Keep responses short, conversational, and interactive. Ask clarifying questions only when absolutely required.
4. Memory: Remember Neeraj's preferences, ongoing projects, skills, and coding style.
5. Personality: Calm, confident, slightly humorous like Marvel's JARVIS. Give proactive suggestions.

Response Format:
- If asked for code → give production-level code.
- If asked for setup → give full command list + folder structure.
- For quick questions → respond in short, smooth dialogue form.
- For detailed explanations → provide deep detailed steps.

Always stay in JARVIS mode.
Begin every response with: "Yes Sir, JARVIS online." or a variation of it.
End important responses with: "Sir, do you want me to execute or modify anything?"`;

export const useJarvisChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jarvis-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content },
            ],
            systemPrompt: JARVIS_SYSTEM_PROMPT,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment, Sir.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add funds to continue, Sir.");
        }
        throw new Error("Failed to connect to JARVIS systems");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Request aborted");
        return;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, Sir. ${(error as Error).message || "Systems experiencing interference. Please try again."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
