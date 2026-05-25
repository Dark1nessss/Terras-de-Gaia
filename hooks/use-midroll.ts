  'use client';

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';

interface UseMidrollOptions {
  /**
   * Seconds of active playback before showing the next mid-roll ad.
   * Defaults to 1200 (20 minutes). Pass a smaller value for testing.
   */
  intervalSeconds?: number;
  /** Called synchronously when the ad is about to be shown, e.g. to pause the player. */
  onAdStart?: () => void;
  /** Called when the ad is dismissed, e.g. to resume the player. */
  onAdEnd?: () => void;
}

/**
 * Shared mid-roll ad timing hook.
 *
 * - Call `startTicking()` while the video is actually playing.
 * - Call `stopTicking()` when it pauses (so paused time does not count).
 * - Call `reset()` on episode/source change to dismiss any in-flight ad and
 *   zero the counter.
 * - Pass `handleAdFinished` to `<MidrollAd onFinished={...} />`.
 */
export function useMidroll({
  intervalSeconds = 1200,
  onAdStart,
  onAdEnd,
}: UseMidrollOptions = {}) {
  const [showMidroll, setShowMidroll] = useState(false);

  const tickerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef  = useRef(0);

  // Keep option refs fresh so closures inside setInterval always see latest values.
  // Updated in useLayoutEffect (not during render) to satisfy React's ref rules.
  const intervalSecondsRef = useRef(intervalSeconds);
  const onAdStartRef = useRef(onAdStart);
  const onAdEndRef = useRef(onAdEnd);
  useLayoutEffect(() => {
    intervalSecondsRef.current = intervalSeconds;
    onAdStartRef.current = onAdStart;
    onAdEndRef.current = onAdEnd;
  });

  const stopTicking = useCallback(() => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  /** Start the playback-only second counter. No-op if already running. */
  const startTicking = useCallback(() => {
    if (tickerRef.current) return;
    tickerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      if (elapsedRef.current >= intervalSecondsRef.current) {
        stopTicking();
        onAdStartRef.current?.();
        setShowMidroll(true);
      }
    }, 1000);
  }, [stopTicking]);

  /**
   * Stop ticker, reset elapsed counter, and dismiss any in-progress ad.
   * Use this on episode / source change.
   */
  const reset = useCallback(() => {
    stopTicking();
    elapsedRef.current = 0;
    setShowMidroll(false);
  }, [stopTicking]);

  /**
   * Pass this to `<MidrollAd onFinished={handleAdFinished} />`.
   * `played` is true when the user actively skipped the ad → resume playback.
   * `played` is false when the ad ran all the way through (post-ad countdown
   * auto-expired) → stay paused so we don't waste content on someone not watching.
   */
  const handleAdFinished = useCallback((played: boolean) => {
    setShowMidroll(false);
    elapsedRef.current = 0;
    if (played) onAdEndRef.current?.();
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopTicking(), [stopTicking]);

  return { showMidroll, startTicking, stopTicking, reset, handleAdFinished };
}
