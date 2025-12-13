import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "./useJarvisChat";

export const useConversationMemory = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);

  // Initialize or get existing conversation
  useEffect(() => {
    const initConversation = async () => {
      // Try to get latest conversation
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (existingConv) {
        setConversationId(existingConv.id);
        
        // Load existing messages
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", existingConv.id)
          .order("created_at", { ascending: true });

        if (messages) {
          setSavedMessages(
            messages.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          );
        }
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({})
          .select()
          .single();

        if (newConv) {
          setConversationId(newConv.id);
        }
      }
      
      setIsInitialized(true);
    };

    initConversation();
  }, []);

  // Save message to database
  const saveMessage = useCallback(
    async (message: Message) => {
      if (!conversationId) return;

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
      });

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    },
    [conversationId]
  );

  // Clear conversation and start fresh
  const clearConversation = useCallback(async () => {
    if (conversationId) {
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);
    }
    setSavedMessages([]);
  }, [conversationId]);

  // Start a new conversation
  const startNewConversation = useCallback(async () => {
    const { data: newConv } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (newConv) {
      setConversationId(newConv.id);
      setSavedMessages([]);
    }
  }, []);

  return {
    conversationId,
    savedMessages,
    isInitialized,
    saveMessage,
    clearConversation,
    startNewConversation,
  };
};
