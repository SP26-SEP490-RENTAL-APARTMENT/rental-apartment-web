import { useCallback, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  appSettingsApi,
  type AppSettingsData,
} from "@/services/privateApi/adminApi";

const DEFAULT_SETTINGS: AppSettingsData = {
  bookingCheckTimeSettings: {
    earlyCheckInFeePercentOfDaily: 0.5,
    lateCheckOutFeePercentPerHour: 0.025,
    lateCheckOutFeeCapPercentOfDaily: 0.25,
    correctionWindowHours: 24,
    tenantResponseSilenceHours: 24,
    noShowGraceHours: 4,
    missingCheckOutGraceHours: 6,
    closedWithoutCheckOutHours: 24,
    automationPollIntervalSeconds: 300,
    feeSettlementGraceDays: 3,
  },
  bookingAdmissionPolicy: {
    graceWindowHours: 24,
    maxSimultaneousUnpaidConfirmedBookings: 2,
    allowedPaymentModesWhenDebtExists: ["full"],
  },
  occupiedRoomAlternatives: { defaultRadiusMeters: 1000 },
  booking: { occupiedIncidentPenaltyRate: 1 },
};

function NumberField({
  label,
  value,
  onChange,
  step,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <Input
        type="number"
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appSettingsApi.getSettings();
      setSettings(res.data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await appSettingsApi.updateSettings(settings);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const bct = settings.bookingCheckTimeSettings;
  const bap = settings.bookingAdmissionPolicy;
  const ora = settings.occupiedRoomAlternatives;
  const bk = settings.booking;

  const setBct = (patch: Partial<typeof bct>) =>
    setSettings((s) => ({
      ...s,
      bookingCheckTimeSettings: { ...s.bookingCheckTimeSettings, ...patch },
    }));

  const setBap = (patch: Partial<typeof bap>) =>
    setSettings((s) => ({
      ...s,
      bookingAdmissionPolicy: { ...s.bookingAdmissionPolicy, ...patch },
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Platform Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure booking, fee, and policy parameters
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading settings...</p>
        ) : (
          <>
            {/* Check-time fee settings */}
            <SectionCard title="Check-Time Fee Settings">
              <NumberField
                label="Early Check-in Fee (% of daily rate)"
                value={bct.earlyCheckInFeePercentOfDaily}
                onChange={(v) => setBct({ earlyCheckInFeePercentOfDaily: v })}
                step={0.01}
                description="Fee charged per hour of early check-in as a fraction of the daily rate"
              />
              <NumberField
                label="Late Check-out Fee per Hour (% of daily rate)"
                value={bct.lateCheckOutFeePercentPerHour}
                onChange={(v) => setBct({ lateCheckOutFeePercentPerHour: v })}
                step={0.001}
                description="Fee charged per hour of late check-out"
              />
              <NumberField
                label="Late Check-out Fee Cap (% of daily rate)"
                value={bct.lateCheckOutFeeCapPercentOfDaily}
                onChange={(v) => setBct({ lateCheckOutFeeCapPercentOfDaily: v })}
                step={0.01}
                description="Maximum total late check-out fee as a fraction of the daily rate"
              />
            </SectionCard>

            {/* Check-time timing windows */}
            <SectionCard title="Check-Time Timing Windows">
              <NumberField
                label="Correction Window (hours)"
                value={bct.correctionWindowHours}
                onChange={(v) => setBct({ correctionWindowHours: v })}
                description="Hours after check-in/out that corrections are allowed"
              />
              <NumberField
                label="Tenant Response Silence (hours)"
                value={bct.tenantResponseSilenceHours}
                onChange={(v) => setBct({ tenantResponseSilenceHours: v })}
                description="Hours before auto-accepting a check-time request tenant hasn't responded to"
              />
              <NumberField
                label="No-show Grace (hours)"
                value={bct.noShowGraceHours}
                onChange={(v) => setBct({ noShowGraceHours: v })}
                description="Hours past scheduled check-in before marking tenant as no-show"
              />
              <NumberField
                label="Missing Check-out Grace (hours)"
                value={bct.missingCheckOutGraceHours}
                onChange={(v) => setBct({ missingCheckOutGraceHours: v })}
                description="Hours past scheduled check-out before triggering missing check-out flow"
              />
              <NumberField
                label="Closed Without Check-out (hours)"
                value={bct.closedWithoutCheckOutHours}
                onChange={(v) => setBct({ closedWithoutCheckOutHours: v })}
                description="Hours before forcibly closing a booking without a recorded check-out"
              />
              <NumberField
                label="Fee Settlement Grace (days)"
                value={bct.feeSettlementGraceDays}
                onChange={(v) => setBct({ feeSettlementGraceDays: v })}
                description="Days granted to settle outstanding check-time fees"
              />
              <NumberField
                label="Automation Poll Interval (seconds)"
                value={bct.automationPollIntervalSeconds}
                onChange={(v) => setBct({ automationPollIntervalSeconds: v })}
                description="How often the automation worker polls for pending check-time transitions"
              />
            </SectionCard>

            {/* Booking admission policy */}
            <SectionCard title="Booking Admission Policy">
              <NumberField
                label="Grace Window (hours)"
                value={bap.graceWindowHours}
                onChange={(v) => setBap({ graceWindowHours: v })}
                description="Hours after booking creation before admission rules are enforced"
              />
              <NumberField
                label="Max Simultaneous Unpaid Confirmed Bookings"
                value={bap.maxSimultaneousUnpaidConfirmedBookings}
                onChange={(v) =>
                  setBap({ maxSimultaneousUnpaidConfirmedBookings: v })
                }
                description="Maximum number of confirmed but unpaid bookings a tenant can hold"
              />
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <Label className="text-sm font-medium text-gray-700">
                  Allowed Payment Modes When Debt Exists
                </Label>
                <p className="text-xs text-gray-500">
                  Comma-separated list of modes (e.g. <code>full</code> or{" "}
                  <code>full,partial</code>)
                </p>
                <Input
                  value={bap.allowedPaymentModesWhenDebtExists.join(",")}
                  onChange={(e) =>
                    setBap({
                      allowedPaymentModesWhenDebtExists: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </SectionCard>

            {/* Occupied room alternatives + booking */}
            <SectionCard title="Occupied Room & Incident Settings">
              <NumberField
                label="Alternative Search Radius (meters)"
                value={ora.defaultRadiusMeters}
                onChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    occupiedRoomAlternatives: { defaultRadiusMeters: v },
                  }))
                }
                description="Search radius used when offering alternative rooms during an occupied incident"
              />
              <NumberField
                label="Occupied Incident Penalty Rate"
                value={bk.occupiedIncidentPenaltyRate}
                onChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    booking: { occupiedIncidentPenaltyRate: v },
                  }))
                }
                step={0.01}
                description="Multiplier applied to daily rate when calculating the landlord penalty for an occupied incident"
              />
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
}
