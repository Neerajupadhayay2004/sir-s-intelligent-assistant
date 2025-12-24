import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Loader2, Paperclip, Palette, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceWave from "./VoiceWave";
import { FileUpload } from "./FileUpload";
import { StyleSelector, ArtStyle } from "./StyleSelector";

interface JarvisInputProps {
  onSend: (message: string, imageData?: string, style?: ArtStyle) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  onFileSelect?: (file: File, base64?: string) => void;
  selectedStyle?: ArtStyle | null;
  onStyleSelect?: (style: ArtStyle) => void;
}

const JarvisInput = ({
  onSend,
  isLoading,
  isListening,
  onToggleVoice,
  onFileSelect,
  selectedStyle,
  onStyleSelect,
}: JarvisInputProps) => {
  const [input, setInput] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<string | null>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim(), pendingImageData || undefined, selectedStyle || undefined);
      setInput("");
      setPendingImageData(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (file: File, base64Data?: string) => {
    // If it's an image, store the base64 for sending with next message
    if (file.type.startsWith('image/') && base64Data) {
      setPendingImageData(base64Data);
      setInput((prev) => prev || "What's in this image?");
    }
    onFileSelect?.(file, base64Data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* File Upload Panel */}
      <FileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onFileSelect={handleFileSelect}
      />

      {/* Style Selector */}
      <StyleSelector
        isOpen={showStyleSelector}
        onClose={() => setShowStyleSelector(false)}
        onSelect={(style) => onStyleSelect?.(style)}
        selectedStyle={selectedStyle || null}
      />

      {/* Voice wave indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2"
        >
          <VoiceWave isActive={isListening} />
        </motion.div>
      )}

      {/* Glow effect behind input */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          opacity: isListening ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      <div className="flex items-center gap-2 md:gap-3 glass-jarvis rounded-2xl p-1.5 md:p-2 shadow-jarvis relative">
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid transparent",
            background: `linear-gradient(90deg, hsl(var(--primary) / 0.3), hsl(var(--secondary) / 0.3), hsl(var(--primary) / 0.3)) border-box`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{
            opacity: isListening ? [0.5, 1, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Style selector button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowStyleSelector(!showStyleSelector)}
          className={`rounded-xl h-10 w-10 md:h-12 md:w-12 transition-all duration-300 touch-manipulation ${
            selectedStyle
              ? "bg-secondary/20 text-secondary ring-2 ring-secondary/50"
              : "text-muted-foreground hover:text-secondary hover:bg-secondary/10"
          }`}
          title="Select Art Style"
        >
          <motion.div
            animate={selectedStyle ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: selectedStyle ? Infinity : 0, repeatDelay: 2 }}
          >
            <Palette className="w-4 h-4 md:w-5 md:h-5" />
          </motion.div>
        </Button>

        {/* File attachment button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFileUpload(!showFileUpload)}
          className={`rounded-xl h-10 w-10 md:h-12 md:w-12 transition-all duration-300 touch-manipulation ${
            showFileUpload
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          }`}
        >
          <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        {/* Voice button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVoice}
          className={`rounded-xl h-10 w-10 md:h-12 md:w-12 transition-all duration-300 relative touch-manipulation ${
            isListening
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          }`}
          style={{
            boxShadow: isListening ? "0 0 20px hsl(var(--primary) / 0.4)" : "none",
          }}
        >
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-xl border border-primary/50"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {isListening ? (
            <Mic className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <MicOff className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </Button>

        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Speak or type, Sir..."}
          disabled={isLoading || isListening}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm md:text-base font-jarvis tracking-wide min-w-0"
        />

        {/* Send button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="rounded-xl h-10 w-10 md:h-12 md:w-12 bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-300 disabled:opacity-30"
          style={{
            boxShadow: input.trim() && !isLoading ? "0 0 15px hsl(var(--primary) / 0.3)" : "none",
          }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default JarvisInput;
