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
import {
  AlertCircle,
  Building2,
  Calendar,
  Eye,
  ShieldX,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface Props {
  occupy: Occupy;
  onOpenPenaltyDialog: (occupy: Occupy) => void;
}
function OccupyActions({ occupy, onOpenPenaltyDialog }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(
    occupy.images?.[0] || "",
  );
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-150 rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Occupied Report
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
            <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-lg mb-5 text-slate-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded"></span>
                Evidence Images
              </h3>

              {/* Main Image Display */}
              <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-white">
                <div className="relative w-full aspect-video bg-slate-100">
                  <img
                    src={selectedImage}
                    alt="Selected evidence"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {occupy.images.findIndex((img) => img === selectedImage) + 1}{" "}
                  / {occupy.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Select Image
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                  {occupy.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 h-20 w-24
                      ${
                        selectedImage === img
                          ? "border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/20"
                          : "border-slate-200 hover:border-slate-400 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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

      <Button
        variant="destructive"
        size="sm"
        onClick={() => onOpenPenaltyDialog(occupy)}
      >
        <ShieldX />
      </Button>
    </div>
  );
}

export default OccupyActions;
