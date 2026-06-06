import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Dispute } from "@/types/checkTime";
import { CircleEllipsis, Eye } from "lucide-react";

interface Props {
  data: Dispute;
  onResolve: (bookingId: string) => void;
}

function DisputeActions({ data, onResolve }: Props) {
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Check Time Dispute</CardTitle>
                  <CardDescription>
                    Created at {formatDate(data.disputeCreatedAt)}
                  </CardDescription>
                </div>

                <Badge className="bg-green-100 text-green-700">
                  {data.disputeResolutionStatus.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Parties */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                  <p className="font-medium">{data.tenantFullName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Landlord</p>
                  <p className="font-medium">{data.landlordFullName}</p>
                </div>
              </div>

              <Separator />

              {/* Booking */}
              <div>
                <h3 className="font-semibold mb-3">Booking Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <InfoItem label="Apartment" value={data.apartmentAddress} />

                  <InfoItem label="Booking Status" value={data.bookingStatus} />

                  <InfoItem
                    label="Check In"
                    value={formatDate(data.checkInDate)}
                  />

                  <InfoItem
                    label="Check Out"
                    value={formatDate(data.checkOutDate)}
                  />

                  <InfoItem label="Nights" value={data.nights} />

                  <InfoItem
                    label="Total Price"
                    value={`${Number(data.totalPrice).toLocaleString()} VNĐ`}
                  />
                </div>
              </div>

              <Separator />

              {/* Reason */}
              <div>
                <h3 className="font-semibold mb-3">Dispute Reason</h3>

                <div className="rounded-lg border bg-muted/30 p-4">
                  {data.disputeReason}
                </div>
              </div>

              {/* Images */}
              {data.checkTimeImages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Check Time Images</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.checkTimeImages.map((img) => (
                      <img
                        key={img}
                        src={img}
                        alt=""
                        className="h-40 w-full rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {data.disputeResolutionStatus === "open" && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onResolve(data.bookingId)}
        >
          <CircleEllipsis className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="font-medium wrap-break-word">{value}</p>
    </div>
  );
}

export default DisputeActions;
