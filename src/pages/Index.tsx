import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import ArcReactor from "@/components/ArcReactor";
import ChatMessage from "@/components/ChatMessage";
import JarvisInput from "@/components/JarvisInput";
import StatusIndicator from "@/components/StatusIndicator";
import HUDOverlay from "@/components/HUDOverlay";
import { useJarvisChat } from "@/hooks/useJarvisChat";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useJarvisChat();
  const { speak, stop } = useTextToSpeech();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string>("");

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) {
        sendMessage(text);
      }
    },
    [sendMessage]
  );

  const { isListening, toggleListening } = useVoiceRecognition(handleVoiceTranscript);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak new assistant messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "assistant" &&
      voiceEnabled &&
      lastMessage.content !== lastMessageRef.current &&
      !isLoading
    ) {
      lastMessageRef.current = lastMessage.content;
      speak(lastMessage.content);
    }
  }, [messages, voiceEnabled, speak, isLoading]);

  const toggleVoice = () => {
    if (voiceEnabled) {
      stop();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="min-h-screen bg-background hex-pattern relative overflow-hidden">
      {/* HUD Overlay */}
      <HUDOverlay />

      {/* Scan lines effect */}
      <div className="fixed inset-0 scan-lines pointer-events-none" />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-glow opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-6"
        >
          <div className="flex items-center gap-4">
            <ArcReactor size="sm" isActive isProcessing={isLoading} />
            <div>
              <h1 className="text-2xl font-bold tracking-widest jarvis-glow-text text-jarvis-cyan">
                J.A.R.V.I.S
              </h1>
              <p className="text-xs text-muted-foreground tracking-wider">
                Just A Rather Very Intelligent System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicator isConnected={true} />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className="text-muted-foreground hover:text-jarvis-cyan"
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              <ArcReactor size="lg" isActive isProcessing={false} />
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-widest jarvis-glow-text text-jarvis-cyan">
                  JARVIS ONLINE
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Good day, Sir. I am at your service. How may I assist you today?
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {[
                    "What can you do?",
                    "Create a project",
                    "System status",
                    "Help me code",
                  ].map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(suggestion)}
                      className="px-4 py-2 text-sm rounded-full border border-jarvis-cyan/30 text-jarvis-cyan/80 hover:bg-jarvis-cyan/10 hover:border-jarvis-cyan/50 transition-all"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={
                    isLoading &&
                    message.role === "assistant" &&
                    message.id === messages[messages.length - 1].id
                  }
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="py-6">
          <JarvisInput
            onSend={sendMessage}
            isLoading={isLoading}
            isListening={isListening}
            onToggleVoice={toggleListening}
          />
          <p className="text-center text-xs text-muted-foreground mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-jarvis-cyan">Enter</kbd> to send • Click mic for voice input
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
