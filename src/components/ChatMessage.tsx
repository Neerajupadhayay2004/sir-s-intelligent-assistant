import { motion } from "framer-motion";
import { Bot, User, Image as ImageIcon, Sparkles, Download } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  imageUrl?: string;
  generatedImage?: string;
}

const ChatMessage = ({ role, content, isStreaming = false, imageUrl, generatedImage }: ChatMessageProps) => {
  const isJarvis = role === "assistant";

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `jarvis-generated-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-2 md:gap-4 ${isJarvis ? "justify-start" : "justify-end"}`}
    >
      {isJarvis && (
        <motion.div 
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3), inset 0 0 10px hsl(var(--primary) / 0.2)",
          }}
        >
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}

      <motion.div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-5 md:py-3 relative overflow-hidden ${
          isJarvis
            ? "glass-jarvis border-primary/30"
            : "bg-secondary/20 border border-secondary/30"
        }`}
        style={{
          boxShadow: isJarvis
            ? "0 0 30px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(var(--primary) / 0.1)"
            : "0 0 30px hsl(var(--secondary) / 0.15), inset 0 1px 0 hsl(var(--secondary) / 0.1)",
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: isJarvis
              ? "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%)"
              : "linear-gradient(135deg, hsl(var(--secondary) / 0.1) 0%, transparent 50%)",
          }}
        />
        
        {/* Uploaded image display */}
        {imageUrl && (
          <motion.div 
            className="mb-3 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative rounded-lg overflow-hidden border border-primary/20">
              <img 
                src={imageUrl} 
                alt="Uploaded image" 
                className="max-w-full max-h-64 object-contain rounded-lg"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary">Image attached</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <p
          className={`text-sm md:text-base leading-relaxed relative z-10 ${
            isJarvis ? "text-foreground" : "text-secondary"
          } ${isStreaming ? "typing-cursor" : ""}`}
        >
          {content.replace(/\n\n\[Generated Image\]$/, '')}
        </p>

        {/* AI Generated image display */}
        {generatedImage && (
          <motion.div 
            className="mt-4 relative"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 group">
              {/* Glowing border effect */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  boxShadow: "0 0 30px hsl(var(--primary) / 0.4), inset 0 0 20px hsl(var(--primary) / 0.2)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 30px hsl(var(--primary) / 0.4), inset 0 0 20px hsl(var(--primary) / 0.2)",
                    "0 0 50px hsl(var(--primary) / 0.6), inset 0 0 30px hsl(var(--primary) / 0.3)",
                    "0 0 30px hsl(var(--primary) / 0.4), inset 0 0 20px hsl(var(--primary) / 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <img 
                src={generatedImage} 
                alt="AI Generated image" 
                className="w-full max-h-80 object-contain rounded-xl"
              />
              
              {/* Label */}
              <div className="absolute top-2 left-2 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
                <span className="text-xs font-medium text-primary-foreground">AI Generated</span>
              </div>

              {/* Download button */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDownload(generatedImage)}
              >
                <Download className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {!isJarvis && (
        <motion.div 
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: "0 0 20px hsl(var(--secondary) / 0.3), inset 0 0 10px hsl(var(--secondary) / 0.2)",
          }}
        >
          <User className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
