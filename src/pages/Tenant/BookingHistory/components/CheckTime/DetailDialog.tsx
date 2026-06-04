import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Summary from "./Summary";
import TimeLine from "./TimeLine";
import FeeBreakDown from "./FeeBreakDown";
import Claim from "./Claim";
import Photos from "./Photos";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";
import DisputeResolution from "./DisputeResolution";

function DetailDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: any;
}) {
  const { t } = useTranslation("paymentHistory");
  const [form, setForm] = useState({
    action: "confirm",
    disputeReason: "",
    notes: "",
  });
  const [isResponse, setIsResponse] = useState(false);

  const handleRespondCheckTime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingApi.respondToCheckTime(data.bookingId, form);
      toast.success("Response submitted successfully");
      setIsResponse(false);
      onClose();
      // refetchCheckTime(data.bookingId);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Unknown error occurred");
      console.error("Error occurred while responding to check time:", error);
    }
  };

  const handlePayOutstandingFee = async () => {
    try {
      const response = await bookingApi.payOutstandingFee(data?.bookingId, {
        paymentMethod: "payos",
        devicePlatform: "web",
      });
      window.location.href = response.data.data.url;
      toast.success("Payment successful");
      onClose();
      // refetchCheckTime(data.bookingId);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Unknown error occurred");
    }
  };

  const isExpired =
    data?.claimExpiresAt && new Date() > new Date(data.claimExpiresAt);

  const canPay = data?.tenantResponseStatus === "confirmed" || isExpired;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("checkTime.title")}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">
              {t("checkTime.overview")}
            </TabsTrigger>
            <TabsTrigger value="photos">{t("checkTime.photos")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Summary data={data} />
            <TimeLine data={data} />
            <FeeBreakDown data={data} />
            <Claim data={data} />
            {(data?.feeSettlementStatus === "waived" ||
              data?.tenantResponseStatus === "refuted") && (
              <DisputeResolution data={data} />
            )}
          </TabsContent>

          <TabsContent value="photos">
            <Photos data={data} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 gap-2">
          {((canPay && data?.feeSettlementStatus !== "paid") ||
            (data?.feeSettlementStatus === "due" &&
              data?.disputeResolutionNotes)) && (
            <Button
              onClick={handlePayOutstandingFee}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Pay Outstanding Fee
            </Button>
          )}

          {data?.tenantResponseStatus !== "confirmed" &&
            !isExpired &&
            data?.feeSettlementStatus !== "waived" &&
            !data?.disputeResolutionNotes &&
            data?.feeSettlementStatus !== "none" && (
              <Button onClick={() => setIsResponse(true)} variant="default">
                {t("checkTime.respondButton") || "Respond to Check Time"}
              </Button>
            )}
          {/* <Button onClick={() => setIsResponse(true)} variant="default">
              {t("checkTime.respondButton") || "Respond to Check Time"}
            </Button> */}
        </div>

        {isResponse && (
          <form
            onSubmit={handleRespondCheckTime}
            className="border rounded-lg p-6 bg-slate-50 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Response</h3>
              <div className="bg-white border rounded-md p-4">
                <RadioGroup
                  value={form.action}
                  onValueChange={(value) => setForm({ ...form, action: value })}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="confirm" id="confirmed" />
                    <Label
                      htmlFor="confirmed"
                      className="font-medium cursor-pointer"
                    >
                      Confirm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dispute" id="dispute" />
                    <Label
                      htmlFor="dispute"
                      className="font-medium cursor-pointer"
                    >
                      Dispute
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {form.action === "dispute" && (
              <div className="space-y-2">
                <Label htmlFor="dispute-reason" className="font-semibold">
                  Reason for Dispute
                </Label>
                <Textarea
                  id="dispute-reason"
                  placeholder="Please provide detailed information about why you are disputing this check time..."
                  value={form.disputeReason}
                  onChange={(e) =>
                    setForm({ ...form, disputeReason: e.target.value })
                  }
                  className="min-h-32"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-semibold">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or information..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="min-h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResponse(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Submit Response
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DetailDialog;
