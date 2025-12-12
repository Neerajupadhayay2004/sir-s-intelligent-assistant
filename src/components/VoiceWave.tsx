import { motion } from "framer-motion";

interface VoiceWaveProps {
  isActive: boolean;
  barCount?: number;
}

const VoiceWave = ({ isActive, barCount = 20 }: VoiceWaveProps) => {
  return (
    <div className="flex items-center justify-center gap-0.5 h-12">
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-jarvis-cyan to-jarvis-cyan-glow rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: isActive
              ? [4, Math.random() * 40 + 8, 4]
              : 4,
          }}
          transition={{
            duration: 0.3 + Math.random() * 0.2,
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse",
            delay: i * 0.05,
          }}
          style={{
            boxShadow: isActive
              ? "0 0 8px hsl(190 100% 50% / 0.6)"
              : "none",
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;
