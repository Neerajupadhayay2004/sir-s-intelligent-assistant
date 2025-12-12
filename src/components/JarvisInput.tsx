import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceWave from "./VoiceWave";

interface JarvisInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
}

const JarvisInput = ({
  onSend,
  isLoading,
  isListening,
  onToggleVoice,
}: JarvisInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Voice wave indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2"
        >
          <VoiceWave isActive={isListening} />
        </motion.div>
      )}

      <div className="flex items-center gap-3 glass-jarvis rounded-2xl p-2 shadow-jarvis">
        {/* Voice button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVoice}
          className={`rounded-xl h-12 w-12 transition-all duration-300 ${
            isListening
              ? "bg-jarvis-cyan/20 text-jarvis-cyan shadow-glow-sm"
              : "text-muted-foreground hover:text-jarvis-cyan hover:bg-jarvis-cyan/10"
          }`}
        >
          {isListening ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>

        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak or type your command, Sir..."
          disabled={isLoading || isListening}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-jarvis tracking-wide"
        />

        {/* Send button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="rounded-xl h-12 w-12 bg-jarvis-cyan/20 text-jarvis-cyan hover:bg-jarvis-cyan/30 hover:text-jarvis-cyan-glow transition-all duration-300 disabled:opacity-30"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default JarvisInput;
