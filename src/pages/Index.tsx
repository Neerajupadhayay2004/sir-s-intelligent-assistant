import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Volume2, VolumeX, Zap } from "lucide-react";
import { useState } from "react";
import HolographicOrb from "@/components/HolographicOrb";
import ChatMessage from "@/components/ChatMessage";
import JarvisInput from "@/components/JarvisInput";
import StatusIndicator from "@/components/StatusIndicator";
import HUDOverlay from "@/components/HUDOverlay";
import FloatingParticles from "@/components/FloatingParticles";
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

  const quickCommands = [
    { text: "What can you do?", icon: "🤖" },
    { text: "Tell me a joke", icon: "😄" },
    { text: "System status", icon: "📊" },
    { text: "Help me code", icon: "💻" },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background hex-pattern relative overflow-hidden">
      {/* Background effects */}
      <FloatingParticles />
      <HUDOverlay />

      {/* Scan lines effect */}
      <div className="fixed inset-0 scan-lines pointer-events-none opacity-50" />

      {/* Central glow */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px]"
          style={{
            background: "radial-gradient(circle, hsl(190 100% 50% / 0.2) 0%, hsl(35 100% 55% / 0.1) 30%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col h-screen h-[100dvh] max-w-4xl mx-auto px-3 md:px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-4 md:py-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mini Arc Reactor for header */}
            <motion.div
              className="w-10 h-10 md:w-14 md:h-14 rounded-full relative flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, hsl(190 100% 50% / 0.3) 0%, transparent 70%)",
                boxShadow: "0 0 30px hsl(190 100% 50% / 0.4)",
              }}
            >
              <motion.div
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-jarvis-cyan/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-jarvis-cyan"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  boxShadow: "0 0 20px hsl(190 100% 50%)",
                }}
              />
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-lg md:text-2xl font-bold tracking-widest jarvis-glow-text text-jarvis-cyan"
                animate={{ 
                  textShadow: [
                    "0 0 10px hsl(190 100% 50% / 0.8)",
                    "0 0 20px hsl(190 100% 50% / 1)",
                    "0 0 10px hsl(190 100% 50% / 0.8)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                J.A.R.V.I.S
              </motion.h1>
              <p className="text-[10px] md:text-xs text-muted-foreground tracking-wider hidden sm:block">
                Just A Rather Very Intelligent System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <StatusIndicator isConnected={true} />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-jarvis-cyan"
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
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto py-2 md:py-4 space-y-3 md:space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full gap-4 md:gap-8 px-4"
            >
              {/* Main Holographic Orb */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <HolographicOrb size="lg" isActive isProcessing={false} />
              </motion.div>

              <div className="text-center space-y-3 md:space-y-4">
                <motion.h2 
                  className="text-2xl md:text-4xl font-bold tracking-widest jarvis-glow-text text-jarvis-cyan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  JARVIS ONLINE
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-sm md:text-base max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Good day, Sir. I am at your service. How may I assist you today?
                </motion.p>
                
                {/* Quick command buttons */}
                <motion.div 
                  className="flex flex-wrap justify-center gap-2 mt-4 md:mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {quickCommands.map((cmd, i) => (
                    <motion.button
                      key={cmd.text}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(190 100% 50% / 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(cmd.text)}
                      className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-full border border-jarvis-cyan/30 text-jarvis-cyan/80 hover:bg-jarvis-cyan/10 hover:border-jarvis-cyan/50 transition-all flex items-center gap-2"
                    >
                      <span>{cmd.icon}</span>
                      <span>{cmd.text}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Powered by indicator */}
                <motion.div
                  className="flex items-center justify-center gap-2 mt-6 md:mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Zap className="w-3 h-3 text-jarvis-orange" />
                  <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider">
                    POWERED BY STARK INDUSTRIES
                  </span>
                  <Zap className="w-3 h-3 text-jarvis-orange" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChatMessage
                    role={message.role}
                    content={message.content}
                    isStreaming={
                      isLoading &&
                      message.role === "assistant" &&
                      message.id === messages[messages.length - 1].id
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="py-3 md:py-6 pb-safe">
          <JarvisInput
            onSend={sendMessage}
            isLoading={isLoading}
            isListening={isListening}
            onToggleVoice={toggleListening}
          />
          <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-jarvis-cyan text-[10px]">Enter</kbd> to send • Click mic for voice
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
