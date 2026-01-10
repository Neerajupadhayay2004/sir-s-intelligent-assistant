import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Volume2, VolumeX, Zap, Plus, Settings } from "lucide-react";
import HolographicOrb from "@/components/HolographicOrb";
import ChatMessage from "@/components/ChatMessage";
import JarvisInput from "@/components/JarvisInput";
import StatusIndicator from "@/components/StatusIndicator";
import HUDOverlay from "@/components/HUDOverlay";
import FloatingParticles from "@/components/FloatingParticles";
import SpeakingIndicator from "@/components/SpeakingIndicator";
import { SettingsPanel, defaultSettings, JarvisSettings } from "@/components/SettingsPanel";
import { ImageEditor } from "@/components/ImageEditor";
import { useJarvisChat } from "@/hooks/useJarvisChat";
import { useConversationMemory } from "@/hooks/useConversationMemory";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useTheme, ThemeType } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArtStyle } from "@/components/StyleSelector";

const Index = () => {
  // All hooks at the top - order matters!
  const { savedMessages, isInitialized, saveMessage, clearConversation, startNewConversation } = useConversationMemory();
  
  const { messages, isLoading, isGeneratingImage, sendMessage, clearMessages, setInitialMessages, actionResult, editImage } = useJarvisChat({
    onMessageSaved: saveMessage,
    initialMessages: savedMessages,
  });
  
  const { speak, stop, isSpeaking, voices, selectedVoice, setSelectedVoice, setRate, setPitch, setVolume } = useTextToSpeech();
  const { currentTheme, setTheme } = useTheme();
  
  // All useState hooks
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<JarvisSettings>(() => {
    const saved = localStorage.getItem('jarvis-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  // All refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string>("");

  // Voice transcript handler - useCallback is a hook
  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) {
        sendMessage(text);
      }
    },
    [sendMessage]
  );

  // useVoiceRecognition hook - always called unconditionally
  const { isListening, toggleListening } = useVoiceRecognition(handleVoiceTranscript);

  // All useEffect hooks
  useEffect(() => {
    if (isInitialized && savedMessages.length > 0) {
      setInitialMessages(savedMessages);
    }
  }, [isInitialized, savedMessages, setInitialMessages]);

  useEffect(() => {
    if (actionResult) {
      toast.success(actionResult, {
        duration: 3000,
      });
    }
  }, [actionResult]);

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
    setSettings(prev => ({ ...prev, voiceEnabled: !voiceEnabled }));
  };

  const handleSettingsChange = (newSettings: JarvisSettings) => {
    setSettings(newSettings);
    localStorage.setItem('jarvis-settings', JSON.stringify(newSettings));
    setVoiceEnabled(newSettings.voiceEnabled);
    setRate(newSettings.voiceSpeed);
    setPitch(newSettings.voicePitch);
  };

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
  };

  const handleFileSelect = (file: File, base64Data?: string) => {
    setSelectedFile(file);
    if (base64Data) {
      // If it's an image, show analysis prompt
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        toast.success(`Image ready for analysis. Type your question about the image.`);
      } else {
        toast.success(`File "${file.name}" attached`);
      }
    }
  };

  // Send message with image and style if selected
  const handleSendMessage = async (content: string, imageData?: string, style?: ArtStyle) => {
    await sendMessage(content, { imageData, style: style || selectedStyle || undefined });
    setSelectedFile(null);
    // Keep style selected for subsequent generations
  };

  const handleExportConversation = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.id,
      })),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-conversation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported successfully");
  };

  const handleClearMessages = async () => {
    clearMessages();
    await clearConversation();
    toast.success("Conversation cleared");
  };

  const handleNewConversation = async () => {
    clearMessages();
    await startNewConversation();
    toast.success("New conversation started");
  };

  const quickCommands = [
    { text: "Kya haal hai?", icon: "👋" },
    { text: "Generate a cyberpunk image of a neon city", icon: "🌃" },
    { text: "Draw an anime girl with flowers", icon: "🎨" },
    { text: "Create a fantasy dragon in watercolor style", icon: "🐉" },
    { text: "Open YouTube", icon: "📺" },
  ];

  const handleImageEdit = async (prompt: string, imageUrl: string) => {
    await editImage(prompt, imageUrl);
    setEditingImage(null);
  };

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
            background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, hsl(var(--secondary) / 0.1) 30%, transparent 70%)",
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
                background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                boxShadow: "0 0 30px hsl(var(--primary) / 0.4)",
              }}
            >
              <motion.div
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-primary/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  boxShadow: "0 0 20px hsl(var(--primary))",
                }}
              />
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-lg md:text-2xl font-bold tracking-widest jarvis-glow-text text-primary"
                animate={{ 
                  textShadow: [
                    "0 0 10px hsl(var(--primary) / 0.8)",
                    "0 0 20px hsl(var(--primary) / 1)",
                    "0 0 10px hsl(var(--primary) / 0.8)",
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
            <AnimatePresence>
              <SpeakingIndicator isActive={isSpeaking} className="hidden sm:flex" />
            </AnimatePresence>
            
            <StatusIndicator isConnected={true} />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewConversation}
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-jarvis-cyan"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-primary"
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
              onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-primary"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearMessages}
              className="w-8 h-8 md:w-9 md:h-9 text-muted-foreground hover:text-destructive"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClearConversation={handleClearMessages}
          onExportConversation={handleExportConversation}
          onThemeChange={handleThemeChange}
          availableVoices={voices}
          onVoiceChange={setSelectedVoice}
        />

        {/* Image Editor */}
        {editingImage && (
          <ImageEditor
            isOpen={!!editingImage}
            onClose={() => setEditingImage(null)}
            imageUrl={editingImage}
            onEdit={handleImageEdit}
          />
        )}

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
                  className="text-2xl md:text-4xl font-bold tracking-widest jarvis-glow-text text-primary"
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
                
                {/* Quick command buttons - horizontal scroll on mobile */}
                <motion.div 
                  className="flex gap-2 mt-4 md:mt-6 overflow-x-auto pb-2 max-w-full px-2 sm:flex-wrap sm:justify-center sm:overflow-visible scrollbar-thin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                    {quickCommands.map((cmd, i) => (
                      <motion.button
                        key={cmd.text}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(cmd.text)}
                        className="flex-shrink-0 px-2.5 py-1.5 xs:px-3 xs:py-2 md:px-4 md:py-2 text-[10px] xs:text-xs md:text-sm rounded-full border border-primary/30 text-primary/80 active:bg-primary/10 hover:bg-primary/10 hover:border-primary/50 transition-all flex items-center gap-1.5 xs:gap-2 touch-manipulation whitespace-nowrap"
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
                  <Zap className="w-3 h-3 text-secondary" />
                  <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider">
                    POWERED BY STARK INDUSTRIES
                  </span>
                  <Zap className="w-3 h-3 text-secondary" />
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
                    imageUrl={message.imageUrl}
                    generatedImage={message.generatedImage}
                    isStreaming={
                      (isLoading || isGeneratingImage) &&
                      message.role === "assistant" &&
                      message.id === messages[messages.length - 1].id
                    }
                    onEditImage={(imageUrl) => setEditingImage(imageUrl)}
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
            onSend={handleSendMessage}
            isLoading={isLoading}
            isListening={isListening}
            onToggleVoice={toggleListening}
            onFileSelect={handleFileSelect}
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
          />
          <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-primary text-[10px]">Enter</kbd> to send • Click mic for voice • Attach files
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
