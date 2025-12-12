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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isJarvis ? "justify-start" : "justify-end"}`}
    >
      {isJarvis && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-jarvis-cyan/20 border border-jarvis-cyan/40 flex items-center justify-center shadow-glow-sm">
          <Bot className="w-5 h-5 text-jarvis-cyan" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          isJarvis
            ? "glass-jarvis border-jarvis-cyan/30"
            : "bg-jarvis-orange/20 border border-jarvis-orange/30"
        }`}
        style={{
          boxShadow: isJarvis
            ? "0 0 20px hsl(190 100% 50% / 0.1)"
            : "0 0 20px hsl(35 100% 55% / 0.1)",
        }}
      >
        <p
          className={`text-sm leading-relaxed ${
            isJarvis ? "text-foreground" : "text-jarvis-orange-glow"
          } ${isStreaming ? "typing-cursor" : ""}`}
        >
          {content}
        </p>
      </div>

      {!isJarvis && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-jarvis-orange/20 border border-jarvis-orange/40 flex items-center justify-center">
          <User className="w-5 h-5 text-jarvis-orange" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
