import { motion } from "framer-motion";
import { Wifi, WifiOff, Battery, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface StatusIndicatorProps {
  isConnected: boolean;
}

const StatusIndicator = ({ isConnected }: StatusIndicatorProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-6 text-xs font-jarvis tracking-widest"
    >
      {/* Time */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span className="jarvis-glow-text text-jarvis-cyan">{formatTime(time)}</span>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3 text-jarvis-cyan" />
            <span className="text-jarvis-cyan">ONLINE</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-destructive" />
            <span className="text-destructive">OFFLINE</span>
          </>
        )}
      </div>

      {/* System status */}
      <div className="flex items-center gap-2 text-jarvis-orange">
        <Battery className="w-3 h-3" />
        <span>SYS OK</span>
      </div>
    </motion.div>
  );
};

export default StatusIndicator;
