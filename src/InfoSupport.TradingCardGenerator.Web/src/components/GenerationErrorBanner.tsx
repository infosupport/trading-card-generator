'use client';

import { useEffect, useRef } from 'react';

const AUTO_DISMISS_MS = 15000;

interface GenerationErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export default function GenerationErrorBanner({ message, onDismiss }: GenerationErrorBannerProps) {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  // Auto-dismiss so an unattended kiosk recovers on its own
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => onDismissRef.current(), AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl flex items-start gap-4 rounded-xl border-2 border-red-400 bg-red-50 px-6 py-4 text-red-800 shadow-2xl"
    >
      <span className="text-2xl leading-none" aria-hidden>⚠️</span>
      <p className="flex-1 text-lg font-medium">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        OK
      </button>
    </div>
  );
}
