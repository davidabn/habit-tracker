'use client';

import { useCallback, useRef } from 'react';

// Gera som de "ding-ding" de conquista usando Web Audio API
function createRewardSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioContext.currentTime;

    // Notas musicais ascendentes (C5 e E5 - intervalo de terça maior, som alegre)
    const notes = [523, 659];
    const noteDuration = 0.12;
    const noteGap = 0.08;

    notes.forEach((freq, index) => {
      const startTime = now + index * (noteDuration + noteGap);

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);

      if (index === notes.length - 1) {
        osc.onended = () => audioContext.close();
      }
    });
  } catch {
    // Silently fail if audio not supported
  }
}

// Gera som de "undo" - notas descendentes
function createUndoSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioContext.currentTime;

    // Notas descendentes (E5 → C5 - inverso do reward, som de "voltar")
    const notes = [659, 440];
    const noteDuration = 0.08;
    const noteGap = 0.04;

    notes.forEach((freq, index) => {
      const startTime = now + index * (noteDuration + noteGap);

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Volume mais baixo e decay mais rápido
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);

      if (index === notes.length - 1) {
        osc.onended = () => audioContext.close();
      }
    });
  } catch {
    // Silently fail if audio not supported
  }
}

export function useCompletionFeedback() {
  const isPlayingRef = useRef(false);

  const triggerFeedback = useCallback((isCompleting: boolean = true) => {
    // Previne múltiplos sons simultâneos
    if (isPlayingRef.current) return;

    // Respeita preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      isPlayingRef.current = true;

      if (isCompleting) {
        createRewardSound();
      } else {
        createUndoSound();
      }

      // Reset após o som terminar
      setTimeout(() => {
        isPlayingRef.current = false;
      }, isCompleting ? 400 : 250);
    }
  }, []);

  return { triggerFeedback };
}
