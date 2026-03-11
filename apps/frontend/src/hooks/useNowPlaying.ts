/**
 * Custom hook for Now Playing live updates.
 *
 * Polls the backend for current playback status and auto-refreshes.
 */

import { useState, useEffect, useCallback } from "react";
import { getNowPlaying, type NowPlayingState } from "../api/devices";

const POLL_INTERVAL_MS = 3000;

export interface UseNowPlayingResult {
  nowPlaying: NowPlayingState | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useNowPlaying(deviceId: string | undefined): UseNowPlayingResult {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingState | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNowPlaying = useCallback(async () => {
    if (!deviceId) return;
    try {
      const data = await getNowPlaying(deviceId);
      setNowPlaying(data);
    } catch (err) {
      console.warn("[useNowPlaying] Failed to fetch:", err);
    }
  }, [deviceId]);

  // Initial fetch + polling
  useEffect(() => {
    if (!deviceId) {
      setNowPlaying(null);
      return;
    }

    setLoading(true);
    fetchNowPlaying().finally(() => setLoading(false));

    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [deviceId, fetchNowPlaying]);

  return { nowPlaying, loading, refresh: fetchNowPlaying };
}
