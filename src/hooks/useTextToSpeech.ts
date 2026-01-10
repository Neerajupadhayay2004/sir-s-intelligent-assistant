import { useCallback, useRef, useState, useEffect } from "react";

interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  config: VoiceConfig;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
}

// JARVIS-like voice preferences (male, British/American, clear)
const PREFERRED_VOICE_NAMES = [
  "daniel", "james", "david", "google uk english male", 
  "microsoft david", "alex", "tom", "google us english",
  "samantha", "karen", "moira", "fiona"
];

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [config, setConfig] = useState<VoiceConfig>({
    rate: 1.0,
    pitch: 0.95,
    volume: 1.0,
  });

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Auto-select best JARVIS-like voice
      if (availableVoices.length > 0 && !selectedVoice) {
        const bestVoice = findBestVoice(availableVoices);
        setSelectedVoice(bestVoice);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, selectedVoice]);

  // Find the best JARVIS-like voice
  const findBestVoice = (availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice => {
    // First, try to find a preferred voice by name
    for (const preferredName of PREFERRED_VOICE_NAMES) {
      const match = availableVoices.find(
        (voice) => voice.name.toLowerCase().includes(preferredName)
      );
      if (match) return match;
    }

    // Fallback: find any English voice
    const englishVoice = availableVoices.find(
      (voice) => voice.lang.startsWith("en")
    );
    if (englishVoice) return englishVoice;

    // Last resort: first available voice
    return availableVoices[0];
  };

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for better speech
    const cleanedText = text
      .replace(/```[\s\S]*?```/g, " code block ") // Replace code blocks
      .replace(/`([^`]+)`/g, "$1") // Remove inline code backticks
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic markdown
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
      .replace(/https?:\/\/\S+/g, " link ") // Replace URLs
      .replace(/\n+/g, ". ") // Convert newlines to pauses
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    if (!cleanedText) return;

    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(cleanedText);

    // Apply voice settings
    if (selectedVoice) {
      utteranceRef.current.voice = selectedVoice;
    }
    utteranceRef.current.rate = config.rate;
    utteranceRef.current.pitch = config.pitch;
    utteranceRef.current.volume = config.volume;

    // Event handlers
    utteranceRef.current.onstart = () => {
      setIsSpeaking(true);
    };

    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    utteranceRef.current.onpause = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current.onresume = () => {
      setIsSpeaking(true);
    };

    // Speak the text
    window.speechSynthesis.speak(utteranceRef.current);
  }, [isSupported, selectedVoice, config]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const setRate = useCallback((rate: number) => {
    setConfig((prev) => ({ ...prev, rate: Math.max(0.5, Math.min(2, rate)) }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setConfig((prev) => ({ ...prev, pitch: Math.max(0, Math.min(2, pitch)) }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setConfig((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    config,
    setRate,
    setPitch,
    setVolume,
  };
};
