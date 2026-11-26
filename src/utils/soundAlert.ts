let audioInstance: HTMLAudioElement | null = null;
let muted = false;
let unlockedOnce = false;

function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio('/honnnneyyyy-alert.mp3');
    audioInstance.preload = 'auto';
    audioInstance.volume = 0.85;
  }
  return audioInstance;
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setSoundMuted(next: boolean): void {
  muted = next;
  if (muted && audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }
}

export function playOnFirstInteractionIfBlocked(): void {
  if (unlockedOnce || typeof window === 'undefined') return;
  const trigger = () => {
    if (unlockedOnce) return;
    unlockedOnce = true;
    window.removeEventListener('pointerdown', trigger);
    window.removeEventListener('keydown', trigger);
    if (!muted) {
      const audio = getAudio();
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', trigger, { once: true });
  window.addEventListener('keydown', trigger, { once: true });
}

/** Returns true if audio started playing, false if blocked by browser autoplay policy. */
export async function playBestieAlert(force = false): Promise<boolean> {
  if (muted && !force) return false;
  try {
    const audio = getAudio();
    audio.currentTime = 0;
    await audio.play();
    unlockedOnce = true;
    return true;
  } catch {
    return false;
  }
}
