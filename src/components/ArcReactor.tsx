import { motion } from "framer-motion";

interface ArcReactorProps {
  isActive?: boolean;
  isProcessing?: boolean;
  size?: "sm" | "md" | "lg";
}

const ArcReactor = ({ isActive = true, isProcessing = false, size = "md" }: ArcReactorProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-jarvis-cyan/20"
        animate={{
          scale: isProcessing ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.1,
        }}
        transition={{
          duration: isProcessing ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-jarvis-cyan/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Ring markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-jarvis-cyan/80 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 30}deg) translateY(-50%) translateX(-50%)`,
              transformOrigin: "0 0",
              marginTop: "-100%",
            }}
          />
        ))}
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-jarvis-cyan/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {/* Segments */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-jarvis-cyan rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateX(${size === "lg" ? 60 : size === "md" ? 40 : 20}px)`,
            }}
            animate={{
              opacity: isProcessing ? [1, 0.3, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.1,
              repeat: isProcessing ? Infinity : 0,
            }}
          />
        ))}
      </motion.div>

      {/* Inner ring with orange accent */}
      <motion.div
        className="absolute inset-8 rounded-full border-2 border-jarvis-orange/50"
        animate={{
          scale: isProcessing ? [1, 0.95, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isProcessing ? Infinity : 0,
        }}
      />

      {/* Core */}
      <motion.div
        className="absolute inset-10 rounded-full bg-gradient-to-br from-jarvis-cyan via-jarvis-cyan-glow to-jarvis-orange"
        animate={{
          opacity: isActive ? [0.8, 1, 0.8] : 0.3,
          scale: isProcessing ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: isProcessing ? 0.3 : 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: isActive
            ? "0 0 20px hsl(190 100% 50% / 0.8), 0 0 40px hsl(190 100% 50% / 0.4), inset 0 0 20px hsl(35 100% 55% / 0.3)"
            : "none",
        }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white"
        animate={{
          opacity: isActive ? [0.9, 1, 0.9] : 0.5,
          boxShadow: isActive
            ? [
                "0 0 10px hsl(0 0% 100% / 0.8)",
                "0 0 20px hsl(0 0% 100% / 1)",
                "0 0 10px hsl(0 0% 100% / 0.8)",
              ]
            : "none",
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

export default ArcReactor;
