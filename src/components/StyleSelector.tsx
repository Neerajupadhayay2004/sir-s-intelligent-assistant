import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ArtStyle = 
  | "photorealistic" 
  | "anime" 
  | "oil-painting" 
  | "cyberpunk" 
  | "watercolor" 
  | "3d-render" 
  | "sketch" 
  | "fantasy" 
  | "pop-art" 
  | "vintage";

interface StyleOption {
  id: ArtStyle;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { 
    id: "photorealistic", 
    name: "Photo Real", 
    emoji: "📷", 
    description: "Ultra-realistic photography",
    gradient: "from-gray-600 to-gray-800"
  },
  { 
    id: "anime", 
    name: "Anime", 
    emoji: "🎌", 
    description: "Studio Ghibli inspired",
    gradient: "from-pink-500 to-purple-600"
  },
  { 
    id: "cyberpunk", 
    name: "Cyberpunk", 
    emoji: "🌃", 
    description: "Neon futuristic city",
    gradient: "from-cyan-500 to-purple-600"
  },
  { 
    id: "oil-painting", 
    name: "Oil Paint", 
    emoji: "🖼️", 
    description: "Classical masterpiece",
    gradient: "from-amber-600 to-orange-800"
  },
  { 
    id: "watercolor", 
    name: "Watercolor", 
    emoji: "🎨", 
    description: "Soft flowing colors",
    gradient: "from-blue-400 to-teal-500"
  },
  { 
    id: "3d-render", 
    name: "3D Render", 
    emoji: "💎", 
    description: "Octane cinema quality",
    gradient: "from-violet-500 to-indigo-600"
  },
  { 
    id: "sketch", 
    name: "Sketch", 
    emoji: "✏️", 
    description: "Pencil drawing art",
    gradient: "from-gray-400 to-gray-600"
  },
  { 
    id: "fantasy", 
    name: "Fantasy", 
    emoji: "🧙", 
    description: "Magical ethereal world",
    gradient: "from-emerald-500 to-teal-700"
  },
  { 
    id: "pop-art", 
    name: "Pop Art", 
    emoji: "🎪", 
    description: "Bold comic style",
    gradient: "from-yellow-400 to-red-500"
  },
  { 
    id: "vintage", 
    name: "Vintage", 
    emoji: "📺", 
    description: "Retro nostalgic feel",
    gradient: "from-amber-700 to-stone-600"
  },
];

interface StyleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (style: ArtStyle) => void;
  selectedStyle: ArtStyle | null;
}

export const StyleSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedStyle 
}: StyleSelectorProps) => {
  const [hoveredStyle, setHoveredStyle] = useState<ArtStyle | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pb-6 sm:pb-8 max-h-[70vh] overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto glass-jarvis rounded-2xl p-3 sm:p-4 shadow-jarvis">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-sm sm:text-lg font-bold text-primary tracking-wider">
                    Select Art Style
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Style Grid */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {STYLE_OPTIONS.map((style, index) => (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onTouchStart={() => setHoveredStyle(style.id)}
                    onTouchEnd={() => setHoveredStyle(null)}
                    onMouseEnter={() => setHoveredStyle(style.id)}
                    onMouseLeave={() => setHoveredStyle(null)}
                    onClick={() => {
                      onSelect(style.id);
                      onClose();
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      relative p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 touch-manipulation
                      ${selectedStyle === style.id 
                        ? "ring-2 ring-primary shadow-glow-md" 
                        : "ring-1 ring-border/50 active:ring-primary/50"
                      }
                    `}
                  >
                    {/* Gradient background */}
                    <motion.div 
                      className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${style.gradient} opacity-20`}
                      animate={{
                        opacity: hoveredStyle === style.id || selectedStyle === style.id ? 0.4 : 0.2
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-0.5 sm:gap-1">
                      <motion.span 
                        className="text-xl sm:text-2xl"
                        animate={{
                          scale: hoveredStyle === style.id ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {style.emoji}
                      </motion.span>
                      <span className="text-[10px] sm:text-xs font-semibold text-foreground">
                        {style.name}
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground line-clamp-1 hidden xs:block">
                        {style.description}
                      </span>
                    </div>

                    {/* Selected indicator */}
                    {selectedStyle === style.id && (
                      <motion.div
                        layoutId="selectedStyle"
                        className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Wand2 className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Selected style description */}
              <AnimatePresence mode="wait">
                {selectedStyle && (
                  <motion.div
                    key={selectedStyle}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border/30"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Wand2 className="w-4 h-4 text-primary" />
                      <span>
                        Ready to generate in{" "}
                        <span className="text-primary font-semibold">
                          {STYLE_OPTIONS.find(s => s.id === selectedStyle)?.name}
                        </span>{" "}
                        style
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StyleSelector;
