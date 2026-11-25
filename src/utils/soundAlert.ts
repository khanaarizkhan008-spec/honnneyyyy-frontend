let audioInstance: HTMLAudioElement | null = null;
let muted = false;

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
    if (!audioInstance) {
      audioInstance = new Audio('/honnnneyyyy-alert.mpeg');
      audioInstance.volume = 0.85;
    }
    audioInstance.currentTime = 0;
    await audioInstance.play();
  } catch {
    // Ignore browser autoplay block if not triggered from a direct gesture
  }
}
