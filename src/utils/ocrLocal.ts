import { createWorker } from 'tesseract.js';

export async function readScreenshotLocally(
  imageFile: File,
  onProgress: (percent: number) => void
): Promise<string> {
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status === 'recognizing text' && typeof message.progress === 'number') {
        onProgress(Math.round(message.progress * 100));
      } else if (typeof message.progress === 'number' && message.progress > 0) {
        onProgress(Math.min(25, Math.round(message.progress * 25)));
      }
    },
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}
