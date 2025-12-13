import { useCallback, useRef, useState } from "react";

export const useTextToSpeech = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.9);

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a male English voice (JARVIS-like)
    const preferredVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        (voice.name.toLowerCase().includes("male") ||
          voice.name.toLowerCase().includes("david") ||
          voice.name.toLowerCase().includes("james") ||
          voice.name.toLowerCase().includes("daniel"))
    ) || voices.find((voice) => voice.lang.startsWith("en"));

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = 1.0;

    window.speechSynthesis.speak(utteranceRef.current);
  }, [rate, pitch]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const isSpeaking = useCallback(() => {
    return window.speechSynthesis.speaking;
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    setRate,
    setPitch,
  };
};
