import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Wand2, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onEdit: (prompt: string, imageUrl: string) => Promise<void>;
}

export const ImageEditor = ({ isOpen, onClose, imageUrl, onEdit }: ImageEditorProps) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const editSuggestions = [
    { text: "Make it more vibrant", icon: "🌈" },
    { text: "Add sunset lighting", icon: "🌅" },
    { text: "Remove background", icon: "✂️" },
    { text: "Add dramatic clouds", icon: "☁️" },
    { text: "Make it darker", icon: "🌙" },
    { text: "Add glow effects", icon: "✨" },
  ];

  const handleEdit = async () => {
    if (!editPrompt.trim()) {
      toast.error("Please describe your edit");
      return;
    }
    
    setIsEditing(true);
    try {
      await onEdit(editPrompt, imageUrl);
      toast.success("Image edited successfully!");
      setEditPrompt("");
    } catch (error) {
      toast.error("Failed to edit image");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jarvis-edited-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Touch and mouse handlers for dragging
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => handleDragEnd();
    const handleGlobalTouchEnd = () => handleDragEnd();
    
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalTouchEnd);
    
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between p-3 sm:p-4 border-b border-border/30"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </motion.div>
                <h2 className="text-sm sm:text-lg font-bold text-primary tracking-wider">
                  Image Editor
                </h2>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Image Canvas */}
            <div 
              ref={containerRef}
              className="flex-1 overflow-hidden relative touch-none select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
                <motion.img
                  src={imageUrl}
                  alt="Editing"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-jarvis"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  draggable={false}
                />
              </motion.div>

              {/* Zoom Controls */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom(0.2)}
                  className="glass-jarvis rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom(-0.2)}
                  className="glass-jarvis rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                >
                  <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="glass-jarvis rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </motion.div>

              {/* Move indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full"
              >
                <Move className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Drag to pan • Pinch to zoom</span>
                <span className="xs:hidden">Drag • Pinch</span>
              </motion.div>
            </div>

            {/* Edit Controls */}
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="p-2 sm:p-4 border-t border-border/30 bg-background/80 backdrop-blur-lg"
            >
              {/* Quick suggestions - horizontal scroll on mobile */}
              <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-thin">
                {editSuggestions.map((suggestion, i) => (
                  <motion.button
                    key={suggestion.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditPrompt(suggestion.text)}
                    className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-full border border-primary/30 text-primary/80 active:bg-primary/10 hover:bg-primary/10 hover:border-primary/50 transition-all flex items-center gap-1 sm:gap-1.5 touch-manipulation"
                  >
                    <span>{suggestion.icon}</span>
                    <span className="whitespace-nowrap">{suggestion.text}</span>
                  </motion.button>
                ))}
              </div>

              {/* Edit input */}
              <div className="flex gap-2 max-w-xl mx-auto">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Describe your edit..."
                  className="flex-1 bg-muted/50 border border-border/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                />
                <Button
                  onClick={handleEdit}
                  disabled={isEditing || !editPrompt.trim()}
                  className="px-4 sm:px-6 rounded-lg sm:rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 touch-manipulation"
                >
                  {isEditing ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageEditor;
