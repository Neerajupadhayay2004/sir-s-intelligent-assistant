import { motion } from "framer-motion";

const HUDOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated corner brackets */}
      <motion.svg 
        className="absolute top-4 left-4 w-16 h-16 md:w-24 md:h-24 text-jarvis-cyan/40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.path
          d="M0 24 L0 0 L24 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </motion.svg>

      <motion.svg 
        className="absolute top-4 right-4 w-16 h-16 md:w-24 md:h-24 text-jarvis-cyan/40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.path
          d="M24 0 L48 0 L48 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(-24, 0)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />
      </motion.svg>

      <motion.svg 
        className="absolute bottom-4 left-4 w-16 h-16 md:w-24 md:h-24 text-jarvis-cyan/40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <motion.path
          d="M0 24 L0 48 L24 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(0, -24)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </motion.svg>

      <motion.svg 
        className="absolute bottom-4 right-4 w-16 h-16 md:w-24 md:h-24 text-jarvis-cyan/40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.path
          d="M24 48 L48 48 L48 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(-24, -24)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
      </motion.svg>

      {/* Animated orbital rings */}
      <motion.div
        className="absolute top-1/4 left-4 md:left-12 w-24 h-24 md:w-40 md:h-40 border border-jarvis-cyan/10 rounded-full"
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div 
          className="absolute -top-1 left-1/2 w-2 h-2 bg-jarvis-cyan rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-4 md:right-12 w-20 h-20 md:w-32 md:h-32 border border-jarvis-orange/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <motion.div 
          className="absolute -bottom-1 left-1/2 w-2 h-2 bg-jarvis-orange rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>

      <motion.div
        className="hidden md:block absolute top-1/2 right-20 w-48 h-48 border border-jarvis-cyan/5 rounded-full"
        animate={{ 
          rotate: 360,
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          opacity: { duration: 5, repeat: Infinity },
        }}
      />

      {/* Enhanced grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(190 100% 50%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(190 100% 50%) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated data streams on sides */}
      <div className="hidden md:block absolute left-8 top-1/4 bottom-1/4 w-px">
        <motion.div
          className="w-full h-8 bg-gradient-to-b from-transparent via-jarvis-cyan to-transparent"
          animate={{ y: ["0%", "1000%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="hidden md:block absolute right-8 top-1/3 bottom-1/3 w-px">
        <motion.div
          className="w-full h-8 bg-gradient-to-b from-transparent via-jarvis-orange to-transparent"
          animate={{ y: ["0%", "800%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>

      {/* Status indicators in corners */}
      <motion.div
        className="absolute top-20 md:top-28 left-4 md:left-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div 
          className="w-2 h-2 bg-jarvis-cyan rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] md:text-xs text-jarvis-cyan/50 font-jarvis tracking-wider">SYS_ONLINE</span>
      </motion.div>

      <motion.div
        className="absolute top-20 md:top-28 right-4 md:right-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] md:text-xs text-jarvis-cyan/50 font-jarvis tracking-wider">NEURAL_LINK</span>
        <motion.div 
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Floating data points */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-jarvis-cyan rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${8 + (i % 3) * 5}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default HUDOverlay;
