import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Occupy } from "@/types/occupy";
import { AlertCircle, Building2, Calendar, Eye, User, Wallet } from "lucide-react";

interface Props {
  occupy: Occupy;
}
function OccupyActions({ occupy }: Props) {
  return (
    <div>
      <Dialog>
  <DialogTrigger asChild>
    <Button size="sm" variant="outline">
      <Eye className="w-4 h-4" />
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[600px] rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        Occupy Report
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-6 py-2">
      {/* Tenant + Landlord */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
            <User className="w-4 h-4" />
            Tenant
          </div>
          <p className="font-semibold">{occupy.tenantFullName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ID: {occupy.tenantId}
          </p>
        </div>

        <div className="rounded-xl border p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
            <User className="w-4 h-4" />
            Landlord
          </div>
          <p className="font-semibold">{occupy.landlordFullName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ID: {occupy.landlordId}
          </p>
        </div>
      </div>

      {/* Apartment */}
      <div className="rounded-xl border p-4">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
          <Building2 className="w-4 h-4" />
          Apartment
        </div>
        <p className="font-medium">{occupy.apartmentAddress}</p>
      </div>

      {/* Stay Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="w-4 h-4" />
            Check-in
          </div>
          <p className="font-semibold">{occupy.checkInDate}</p>
        </div>

        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="w-4 h-4" />
            Check-out
          </div>
          <p className="font-semibold">{occupy.checkOutDate}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border p-4 bg-blue-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className="bg-green-500 hover:bg-green-500">
            {occupy.bookingStatus}
          </Badge>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">Nights</span>
          <span className="font-semibold">{occupy.nights}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4" />
            Total Price
          </div>
          <span className="font-bold text-lg text-primary">
            {occupy.totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Support */}
      <div className="text-sm text-muted-foreground text-center">
        Support tickets:{" "}
        <span className="font-semibold text-foreground">
          {occupy.supportTicketCount}
        </span>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}

export default OccupyActions;
