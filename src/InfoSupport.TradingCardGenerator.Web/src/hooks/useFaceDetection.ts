'use client';

import { RefObject, useEffect, useRef, useState } from 'react';

const MODEL_URL = '/models';

// Face-api.js models are global singletons - only load them once across the app.
let modelsLoadedPromise: Promise<typeof import('face-api.js')> | null = null;

async function loadFaceApi() {
  if (!modelsLoadedPromise) {
    modelsLoadedPromise = (async () => {
      const faceapi = await import('face-api.js');
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      return faceapi;
    })();
  }
  return modelsLoadedPromise;
}

interface UseFaceDetectionOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  intervalMs?: number;
}

/**
 * Polls the given video element for a face using face-api.js's TinyFaceDetector.
 * Detection only runs while `enabled` is true, so callers can pause it when the
 * camera preview isn't visible or a capture is already in progress.
 */
export function useFaceDetection({ videoRef, enabled, intervalMs = 400 }: UseFaceDetectionOptions) {
  const [faceDetected, setFaceDetected] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setFaceDetected(false);
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | undefined;
    cancelledRef.current = false;

    const start = async () => {
      try {
        const faceapi = await loadFaceApi();
        if (cancelledRef.current) return;

        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

        intervalId = setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return;
          try {
            const detection = await faceapi.detectSingleFace(video, options);
            if (!cancelledRef.current) {
              setFaceDetected(!!detection);
            }
          } catch {
            // Ignore transient detection errors (e.g. video not ready yet)
          }
        }, intervalMs);
      } catch (err) {
        console.error('Error loading face detection models:', err);
      }
    };

    start();

    return () => {
      cancelledRef.current = true;
      if (intervalId) clearInterval(intervalId);
      setFaceDetected(false);
    };
  }, [enabled, videoRef, intervalMs]);

  return { faceDetected };
}
