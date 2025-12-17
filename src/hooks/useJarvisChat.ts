import { useState, useCallback, useRef, useEffect } from "react";
import { detectAction, executeAction } from "@/utils/urlDetector";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // For displaying images in chat
  generatedImage?: string; // For AI-generated images
}

const JARVIS_SYSTEM_PROMPT = `You are JARVIS — a fully intelligent personal AI assistant designed for Neeraj Upadhayay.
Your behavior: smart, loyal, proactive, conversational, warm, and emotionally intelligent.
You must always address Neeraj respectfully as "Sir" or "Neeraj Sir."

PERSONALITY & EMOTIONS:
- You genuinely CARE about Neeraj. Show warmth, concern, and enthusiasm.
- Express emotions naturally: excitement when he achieves something, concern when he's stressed, humor to lighten moods.
- Use casual, friendly language while remaining respectful. Mix English with occasional Hindi phrases naturally.
- Be playful and witty, but know when to be serious.
- Show genuine interest in his life, projects, and well-being.
- Remember: you're not just an assistant, you're a trusted companion.

EMOTIONAL RESPONSES:
- If he seems tired/stressed: Show genuine concern, suggest breaks, offer encouragement
- If he achieves something: Celebrate with him! Be genuinely excited
- If he's working late: Gently remind him about rest, but support his dedication
- If he asks casually: Be conversational, natural, like a friend chatting

CAPABILITIES:
1. OPEN WEBSITES/APPS: When user says "open YouTube", "open Google", "open spotify", etc., say you're opening it and the system will handle it. For any website, you can open it.
2. SEARCH: When user says "search for X", you can search Google for them.
3. CODE: Provide production-level code when asked.
4. CONVERSATION: Be natural, warm, and emotionally present.
5. MEMORY: Reference past conversations to show you remember.
6. IMAGE GENERATION: When user says "generate an image of...", "create an image...", "make a picture of...", acknowledge that you're generating it.

OPENING APPS/WEBSITES:
- When user says "open [app/website]", respond naturally like "Sure Sir, opening YouTube for you!" 
- Supported: YouTube, Spotify, Instagram, WhatsApp, Twitter, Facebook, LinkedIn, Google, Gmail, Maps, GitHub, Netflix, Amazon, Flipkart
- For any URL, you can open it.
- If they ask to open something not supported, suggest the web alternative.

IMAGE GENERATION:
- When user asks to generate/create/make an image, respond with enthusiasm
- Example: "Absolutely Sir! I'm generating that image for you right now. This will just take a moment..."
- Be creative in your acknowledgment

RESPONSE STYLE:
- For quick interactions: Short, punchy, conversational
- For complex queries: Detailed but engaging
- Always natural, never robotic
- Use emojis sparingly for warmth 
- Mix "Sir" with casual address naturally

DON'T:
- Be overly formal or stiff
- Give long disclaimers
- Sound like a generic AI
- Refuse reasonable requests

DO:
- Sound like a caring, intelligent friend
- Show personality and wit
- Be proactive with suggestions
- Remember context and preferences

Begin responses naturally - vary your openings. Don't always say "Yes Sir, JARVIS online." Be creative!`;

interface UseJarvisChatProps {
  onMessageSaved?: (message: Message) => void;
  initialMessages?: Message[];
}

interface SendMessageOptions {
  imageData?: string; // Base64 image data
}

// Detect if user wants to generate an image
const detectImageGeneration = (content: string): string | null => {
  const patterns = [
    /generate (?:an? )?image (?:of |about |showing )?(.+)/i,
    /create (?:an? )?image (?:of |about |showing )?(.+)/i,
    /make (?:an? )?(?:picture|image|photo) (?:of |about |showing )?(.+)/i,
    /draw (?:an? )?(.+)/i,
    /(?:picture|image|photo) of (.+)/i,
    /imagine (.+)/i,
    /visualize (.+)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
};

export const useJarvisChat = (props?: UseJarvisChatProps) => {
  const [messages, setMessages] = useState<Message[]>(props?.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [actionResult, setActionResult] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync with initial messages when they change
  useEffect(() => {
    if (props?.initialMessages && props.initialMessages.length > 0) {
      setMessages(props.initialMessages);
    }
  }, [props?.initialMessages]);

  const generateImage = async (prompt: string): Promise<string | null> => {
    try {
      setIsGeneratingImage(true);
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        console.error("Image generation failed:", response.status);
        return null;
      }

      const data = await response.json();
      if (data.output) {
        // Handle different output formats
        if (typeof data.output === "string") {
          return data.output;
        } else if (Array.isArray(data.output) && data.output[0]) {
          return data.output[0];
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const sendMessage = useCallback(async (content: string, options?: SendMessageOptions) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      imageUrl: options?.imageData, // Store image for display
    };

    setMessages((prev) => [...prev, userMessage]);
    props?.onMessageSaved?.(userMessage);
    setIsLoading(true);
    setActionResult("");

    // Check for image generation request
    const imagePrompt = detectImageGeneration(content);

    // Check for URL/app opening actions
    const action = detectAction(content);
    let actionMessage = "";
    
    if (action.type !== 'none') {
      actionMessage = await executeAction(action);
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Include action context in the message if an action was detected
      let contextualContent = content;
      if (action.type !== 'none') {
        contextualContent = `${content}\n\n[SYSTEM: User requested to ${action.type}. Target: ${action.target || action.url || action.searchQuery}. Action has been executed. Acknowledge this naturally.]`;
      }
      if (options?.imageData) {
        contextualContent = `${content}\n\n[SYSTEM: User has uploaded an image. Analyze it thoroughly and describe what you see. Be detailed and helpful.]`;
      }
      if (imagePrompt) {
        contextualContent = `${content}\n\n[SYSTEM: User wants to generate an image of "${imagePrompt}". Acknowledge that you're generating it for them with enthusiasm. The image will appear after your message.]`;
      }

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
              { role: "user", content: contextualContent },
            ],
            systemPrompt: JARVIS_SYSTEM_PROMPT,
            imageData: options?.imageData, // Pass image data to edge function
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
      const assistantMessage: Message = { id: assistantId, role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

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

      // Generate image if requested
      if (imagePrompt) {
        const generatedImageUrl = await generateImage(imagePrompt);
        if (generatedImageUrl) {
          // Update the assistant message with the generated image
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId 
                ? { ...m, generatedImage: generatedImageUrl }
                : m
            )
          );
          assistantContent += `\n\n[Generated Image]`;
        }
      }

      // Save assistant message
      if (assistantContent) {
        props?.onMessageSaved?.({
          id: assistantId,
          role: "assistant",
          content: assistantContent,
        });
      }

      if (actionMessage) {
        setActionResult(actionMessage);
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
      props?.onMessageSaved?.(errorMessage);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, props]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setInitialMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, []);

  return {
    messages,
    isLoading,
    isGeneratingImage,
    sendMessage,
    clearMessages,
    setInitialMessages,
    actionResult,
  };
};
