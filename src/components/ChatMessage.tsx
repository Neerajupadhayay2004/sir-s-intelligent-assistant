import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ role, content, isStreaming = false }: ChatMessageProps) => {
  const isJarvis = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-2 md:gap-4 ${isJarvis ? "justify-start" : "justify-end"}`}
    >
      {isJarvis && (
        <motion.div 
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-jarvis-cyan/20 border border-jarvis-cyan/40 flex items-center justify-center relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: "0 0 20px hsl(190 100% 50% / 0.3), inset 0 0 10px hsl(190 100% 50% / 0.2)",
          }}
        >
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-jarvis-cyan" />
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-jarvis-cyan/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}

      <motion.div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-5 md:py-3 relative overflow-hidden ${
          isJarvis
            ? "glass-jarvis border-jarvis-cyan/30"
            : "bg-jarvis-orange/20 border border-jarvis-orange/30"
        }`}
        style={{
          boxShadow: isJarvis
            ? "0 0 30px hsl(190 100% 50% / 0.15), inset 0 1px 0 hsl(190 100% 70% / 0.1)"
            : "0 0 30px hsl(35 100% 55% / 0.15), inset 0 1px 0 hsl(35 100% 70% / 0.1)",
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: isJarvis
              ? "linear-gradient(135deg, hsl(190 100% 50% / 0.1) 0%, transparent 50%)"
              : "linear-gradient(135deg, hsl(35 100% 55% / 0.1) 0%, transparent 50%)",
          }}
        />
        
        <p
          className={`text-sm md:text-base leading-relaxed relative z-10 ${
            isJarvis ? "text-foreground" : "text-jarvis-orange-glow"
          } ${isStreaming ? "typing-cursor" : ""}`}
        >
          {content}
        </p>
      </motion.div>

      {!isJarvis && (
        <motion.div 
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-jarvis-orange/20 border border-jarvis-orange/40 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: "0 0 20px hsl(35 100% 55% / 0.3), inset 0 0 10px hsl(35 100% 55% / 0.2)",
          }}
        >
          <User className="w-4 h-4 md:w-5 md:h-5 text-jarvis-orange" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
