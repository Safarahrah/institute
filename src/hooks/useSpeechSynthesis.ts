import { useState, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const { rate = 1, pitch = 1, volume = 1 } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = window.speechSynthesis;

  const speak = useCallback((text: string) => {
    if (!synth) return;

    synth.cancel();
    setIsPlaying(true);
    setIsPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = 'fr-FR';

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
  }, [synth, rate, pitch, volume]);

  const pause = useCallback(() => {
    if (synth && isPlaying) {
      synth.pause();
      setIsPaused(true);
    }
  }, [synth, isPlaying]);

  const resume = useCallback(() => {
    if (synth && isPaused) {
      synth.resume();
      setIsPaused(false);
    }
  }, [synth, isPaused]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [synth]);

  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  return {
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
  };
}
