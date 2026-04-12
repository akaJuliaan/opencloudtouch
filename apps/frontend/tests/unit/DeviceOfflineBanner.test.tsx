/**
 * Tests for DeviceOfflineBanner component
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DeviceOfflineBanner from "../../src/components/DeviceOfflineBanner";

describe("DeviceOfflineBanner", () => {
  it("renders offline banner with default text", () => {
    render(<DeviceOfflineBanner />);
    expect(screen.getByText("Gerät nicht erreichbar")).toBeInTheDocument();
    expect(
      screen.getByText("Das Gerät ist offline oder nicht im Netzwerk."),
    ).toBeInTheDocument();
  });

  it("renders offline banner with device name", () => {
    render(<DeviceOfflineBanner deviceName="Wohnzimmer" />);
    expect(screen.getByText("Gerät nicht erreichbar")).toBeInTheDocument();
    expect(
      screen.getByText(/Wohnzimmer.+ist offline oder nicht im Netzwerk/),
    ).toBeInTheDocument();
  });

  it("has role=alert for accessibility", () => {
    render(<DeviceOfflineBanner />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
