/**
 * Tests for useVolume hook — device offline state
 * Regression test for #82: offline device must surface error to UI
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useVolume } from "../../src/hooks/useVolume";
import { _resetOfflineStore } from "../../src/api/offlineDeviceStore";

describe("useVolume – device offline", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    _resetOfflineStore();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("sets deviceOffline=true on 503 response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    const { result } = renderHook(() => useVolume("device-123"));

    await waitFor(() => {
      expect(result.current.deviceOffline).toBe(true);
    });
  });

  it("persists offline across new hook instances (session-level)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    const { result } = renderHook(() => useVolume("device-123"));

    await waitFor(() => {
      expect(result.current.deviceOffline).toBe(true);
    });

    // New hook instance — should be offline immediately without new request
    const callCountBefore = mockFetch.mock.calls.length;
    const { result: result2 } = renderHook(() => useVolume("device-123"));

    await waitFor(() => {
      expect(result2.current.deviceOffline).toBe(true);
    });

    // No new fetch calls
    expect(mockFetch.mock.calls.length).toBe(callCountBefore);
  });
});
