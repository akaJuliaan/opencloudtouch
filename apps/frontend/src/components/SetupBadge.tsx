/**
 * Setup Badge Component
 *
 * Visual indicator showing device setup status on device cards.
 * Fetches live setup status from the API so it properly reflects
 * configured/unconfigured state without relying on the device list.
 * Click navigates to setup wizard for that device.
 */
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSetupStatus } from "../api/setup";
import "./SetupBadge.css";

interface SetupBadgeProps {
  deviceId: string;
  setupStatus?: "unconfigured" | "configured" | "pending" | "in_progress" | "failed";
}

type DisplayStatus = "unknown" | "unconfigured" | "configured" | "pending" | "failed";

const STATUS_CONFIG: Record<DisplayStatus, { cls: string; icon: string; title: string }> = {
  unknown: {
    cls: "setup-badge badge-unknown",
    icon: "⚙️",
    title: "Gerät einrichten",
  },
  unconfigured: {
    cls: "setup-badge badge-unconfigured",
    icon: "⚙️",
    title: "Setup erforderlich - Klicken zum Konfigurieren",
  },
  configured: {
    cls: "setup-badge badge-configured",
    icon: "✓",
    title: "Gerät konfiguriert",
  },
  pending: {
    cls: "setup-badge badge-pending",
    icon: "⏳",
    title: "Setup läuft...",
  },
  failed: {
    cls: "setup-badge badge-unconfigured",
    icon: "⚠️",
    title: "Setup fehlgeschlagen - Klicken zum Wiederholen",
  },
};

export default function SetupBadge({ deviceId, setupStatus }: Readonly<SetupBadgeProps>) {
  const navigate = useNavigate();

  const { data: progress } = useQuery({
    queryKey: ["setup-status", deviceId],
    queryFn: () => getSetupStatus(deviceId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleClick = () => {
    navigate(`/setup-wizard?deviceId=${deviceId}`);
  };

  // Prop takes precedence (e.g. during active wizard), else use fetched status.
  // progress === undefined means still loading; progress === null means no record.
  let displayStatus: DisplayStatus;
  if (setupStatus !== undefined) {
    displayStatus = setupStatus === "in_progress" ? "pending" : (setupStatus as DisplayStatus);
  } else if (progress?.status === "configured") {
    displayStatus = "configured";
  } else if (progress?.status === "pending") {
    displayStatus = "pending";
  } else if (progress?.status === "failed" || progress?.status === "unconfigured") {
    displayStatus = progress.status as DisplayStatus;
  } else {
    // null (no record) or still loading → neutral gray gear
    displayStatus = "unknown";
  }

  const { cls, icon, title } = STATUS_CONFIG[displayStatus];

  return (
    <button
      className={cls}
      onClick={handleClick}
      title={title}
      aria-label={title}
      data-test="setup-button"
    >
      <span className="badge-icon">{icon}</span>
    </button>
  );
}
