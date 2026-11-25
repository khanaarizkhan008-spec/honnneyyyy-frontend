let audioInstance: HTMLAudioElement | null = null;
let muted = false;
let pendingUnlock = false;

function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio('/honnnneyyyy-alert.mp3');
    audioInstance.preload = 'auto';
    audioInstance.volume = 0.85;
  }
  return audioInstance;
}

function attachOneTimeUnlock() {
  if (pendingUnlock || typeof window === 'undefined') return;
  pendingUnlock = true;

  const unlockAndPlay = () => {
    pendingUnlock = false;
    window.removeEventListener('pointerdown', unlockAndPlay);
    window.removeEventListener('keydown', unlockAndPlay);
    if (!muted) {
      const audio = getAudio();
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    }
  };

  window.addEventListener('pointerdown', unlockAndPlay, { once: true });
  window.addEventListener('keydown', unlockAndPlay, { once: true });
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

export async function playBestieAlert(force = false): Promise<void> {
  if (muted && !force) return;
  try {
    const audio = getAudio();
    audio.currentTime = 0;
    await audio.play();
  } catch {
    // Browser blocked unmuted autoplay before first gesture — play on first tap
    attachOneTimeUnlock();
  }
}
