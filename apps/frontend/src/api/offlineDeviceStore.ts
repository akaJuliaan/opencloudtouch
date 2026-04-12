/**
 * Session-level offline device registry.
 *
 * Once a device is detected as offline (503/500 from backend),
 * it stays marked offline for the entire browser session.
 * A page reload (F5) clears the registry and retries all devices.
 */

const offlineDevices = new Set<string>();

/** Mark a device as offline for this session. */
export function markDeviceOffline(deviceId: string): void {
  offlineDevices.add(deviceId);
}

/** Check if a device is marked offline. */
export function isDeviceOffline(deviceId: string): boolean {
  return offlineDevices.has(deviceId);
}

/** Get all offline device IDs (for UI rendering). */
export function getOfflineDeviceIds(): ReadonlySet<string> {
  return offlineDevices;
}

/** Clear all offline markers (for testing only). */
export function _resetOfflineStore(): void {
  offlineDevices.clear();
}
