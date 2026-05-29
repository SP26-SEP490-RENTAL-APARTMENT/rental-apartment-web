import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Dispute } from "@/types/checkTime";
import { Eye } from "lucide-react";

interface Props {
  data: Dispute;
}

function DisputeActions({ data }: Props) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Dispute Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* STATUS */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive">Disputed</Badge>

              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {data.disputeResolutionStatus}
              </Badge>

              <Badge variant="secondary">{data.bookingStatus}</Badge>
            </div>

            {/* BOOKING INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-3">
                <h3 className="font-semibold text-base">Booking Information</h3>

                <InfoRow label="Booking ID" value={data.bookingId} />

                <InfoRow label="Apartment" value={data.apartmentAddress} />

                <InfoRow label="Check In" value={data.checkInDate} />

                <InfoRow label="Check Out" value={data.checkOutDate} />

                <InfoRow label="Nights" value={`${data.nights} night`} />

                <InfoRow label="Total Price" value={`${data.totalPrice.toLocaleString()} đ`} />
              </div>

              {/* PEOPLE */}
              <div className="rounded-xl border p-4 space-y-3">
                <h3 className="font-semibold text-base">Participants</h3>

                <InfoRow label="Tenant" value={data.tenantFullName} />

                <InfoRow label="Landlord" value={data.landlordFullName} />

                <InfoRow
                  label="Support Tickets"
                  value={String(data.supportTicketCount)}
                />

                <InfoRow label="Ticket ID" value={data.ticketId} />
              </div>
            </div>

            {/* DISPUTE REASON */}
            <div className="rounded-xl border p-4 space-y-3">
              <h3 className="font-semibold text-base">Dispute Reason</h3>

              <div className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
                {data.disputeReason}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <InfoRow
                  label="Dispute Created"
                  value={new Date(data.disputeCreatedAt).toLocaleString()}
                />

                <InfoRow
                  label="Check Time Evidence Created"
                  value={new Date(data.createdAt).toLocaleString()}
                />
              </div>
            </div>

            {/* EVIDENCE */}
            <div className="rounded-xl border p-4 space-y-4">
              <h3 className="font-semibold text-base">Evidence Images</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.checkTimeImages.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border bg-muted"
                  >
                    <img
                      src={image}
                      alt={`evidence-${index}`}
                      className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>

      <span className="text-sm font-medium break-all">{value}</span>
    </div>
  );
}

export default DisputeActions;
