import { motion } from "framer-motion";

interface SpeakingIndicatorProps {
  isActive: boolean;
  className?: string;
}

const SpeakingIndicator = ({ isActive, className = "" }: SpeakingIndicatorProps) => {
  if (!isActive) return null;

  const bars = [0, 1, 2, 3, 4];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center gap-1 px-3 py-2 rounded-full bg-primary/10 border border-primary/30 ${className}`}
      style={{
        boxShadow: "0 0 20px hsl(var(--primary) / 0.2)",
      }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-primary mr-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
        style={{
          boxShadow: "0 0 8px hsl(var(--primary))",
        }}
      />
      
      {/* Waveform bars */}
      <div className="flex items-center gap-0.5 h-4">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-primary"
            animate={{
              height: ["8px", "16px", "6px", "14px", "8px"],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 4px hsl(var(--primary) / 0.6)",
            }}
          />
        ))}
      </div>

      <span className="text-xs text-primary ml-2 font-medium tracking-wider">
        SPEAKING
      </span>
    </motion.div>
  );
};

export default SpeakingIndicator;
