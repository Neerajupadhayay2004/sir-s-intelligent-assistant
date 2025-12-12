import { motion } from "framer-motion";

interface HolographicOrbProps {
  isActive?: boolean;
  isProcessing?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const HolographicOrb = ({ isActive = true, isProcessing = false, size = "lg" }: HolographicOrbProps) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56",
    xl: "w-72 h-72",
  };

  const orbScale = {
    sm: 0.5,
    md: 0.7,
    lg: 1,
    xl: 1.3,
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center perspective-1000`}>
      {/* Outer pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(190 100% 50% / 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: isProcessing ? [1, 1.5, 1] : [1, 1.2, 1],
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.1,
        }}
        transition={{
          duration: isProcessing ? 0.8 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3D Rotating outer ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-jarvis-cyan/60 preserve-3d"
        animate={{ 
          rotateX: [0, 360],
          rotateY: [0, 180],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-jarvis-cyan rounded-full shadow-glow-sm"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateX(${(size === "xl" ? 90 : size === "lg" ? 70 : size === "md" ? 50 : 30)}px) translateY(-50%)`,
            }}
            animate={{
              opacity: isProcessing ? [1, 0.3, 1] : [0.6, 1, 0.6],
              scale: isProcessing ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>

      {/* Second ring - counter rotation */}
      <motion.div
        className="absolute inset-8 rounded-full border border-jarvis-cyan/40 preserve-3d"
        animate={{ 
          rotateY: [0, -360],
          rotateZ: [0, 180],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-4 bg-gradient-to-b from-jarvis-cyan to-transparent rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 30}deg) translateY(-${(size === "xl" ? 70 : size === "lg" ? 55 : size === "md" ? 40 : 25)}px)`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </motion.div>

      {/* Third ring with orange accent */}
      <motion.div
        className="absolute inset-12 rounded-full border-2 border-jarvis-orange/40 preserve-3d"
        animate={{ 
          rotateX: [0, -360],
          rotateZ: [0, 360],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* Holographic sphere core */}
      <motion.div
        className="absolute inset-16 rounded-full overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 30% 30%, hsl(190 100% 70% / 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, hsl(35 100% 55% / 0.4) 0%, transparent 50%),
            radial-gradient(circle, hsl(190 100% 50% / 0.6) 0%, hsl(220 25% 10%) 100%)
          `,
          boxShadow: `
            0 0 60px hsl(190 100% 50% / 0.6),
            0 0 120px hsl(190 100% 50% / 0.3),
            inset 0 0 40px hsl(190 100% 70% / 0.5),
            inset 0 -20px 40px hsl(35 100% 55% / 0.3)
          `,
        }}
        animate={{
          scale: isProcessing ? [1, 1.1, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: isProcessing ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Animated scan line */}
        <motion.div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Center bright point */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white"
        style={{
          boxShadow: `
            0 0 20px white,
            0 0 40px hsl(190 100% 50%),
            0 0 60px hsl(190 100% 50% / 0.5)
          `,
        }}
        animate={{
          opacity: isActive ? [0.8, 1, 0.8] : 0.3,
          scale: isProcessing ? [1, 1.3, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: isProcessing ? 0.3 : 1.5,
          repeat: Infinity,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-jarvis-cyan rounded-full"
          style={{
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos(i * 60 * (Math.PI / 180)) * 80 * orbScale[size], 0],
            y: [0, Math.sin(i * 60 * (Math.PI / 180)) * 80 * orbScale[size], 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default HolographicOrb;
