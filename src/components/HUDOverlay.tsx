import { motion } from "framer-motion";

const HUDOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Corner brackets */}
      <svg className="absolute top-4 left-4 w-20 h-20 text-jarvis-cyan/30">
        <path
          d="M0 20 L0 0 L20 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <svg className="absolute top-4 right-4 w-20 h-20 text-jarvis-cyan/30">
        <path
          d="M20 0 L40 0 L40 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(-20, 0)"
        />
      </svg>
      <svg className="absolute bottom-4 left-4 w-20 h-20 text-jarvis-cyan/30">
        <path
          d="M0 20 L0 40 L20 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(0, -20)"
        />
      </svg>
      <svg className="absolute bottom-4 right-4 w-20 h-20 text-jarvis-cyan/30">
        <path
          d="M20 40 L40 40 L40 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="translate(-20, -20)"
        />
      </svg>

      {/* Decorative circles */}
      <motion.div
        className="absolute top-1/4 left-8 w-32 h-32 border border-jarvis-cyan/10 rounded-full rotate-slow"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-8 w-24 h-24 border border-jarvis-cyan/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(190 100% 50%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(190 100% 50%) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating data points */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-jarvis-cyan rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 8}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default HUDOverlay;
