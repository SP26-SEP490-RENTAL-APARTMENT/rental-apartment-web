import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ApartmentAction from "./ApartmentAction";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export const ApartmentColumns = (
  onDelete: (id: string) => void,
  onEdit: (apartment: Apartment) => void,
  onAddAmenity: (apartmentId: string, amenities: string[]) => Promise<void>,
  onAddPackage: (apartment: Apartment) => void,
  onCreateRoom: (apartment: Apartment) => void,
  onAddAvailability: (apartmentId: string) => void,
  onViewPackage: (apartmentId: string) => void,
  onSendApprove: (apartmentId: string) => void,
  onAddPhotos: (apartmentId: string, files: File[]) => Promise<void>,
  onChangePrice: (apartmentId: string) => void,
  onViewPriceChange: (apartmentId: string) => void,
): ColumnDef<Apartment>[] => {
  const { t } = useTranslation("landlord");
  const { t: statusT } = useTranslation("status");

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "posted":
        return (
          <Badge className="bg-blue-500 text-white">
            {statusT("apartment.posted")}
          </Badge>
        );
      case "pending_review":
        return (
          <Badge className="bg-gray-500 text-white">
            {statusT("apartment.pending")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{statusT("apartment.draft")}</Badge>;
    }
  };

  const getInspectionStatusBadge = (inspectionStatus?: string) => {
    switch (inspectionStatus) {
      case "scheduled":
        return <Badge className="bg-blue-500 text-white">{statusT("inspection.scheduled")}</Badge>;
      case "in_progress":
        return <Badge className="bg-green-500 text-white">{statusT("inspection.in_progress")}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">{statusT("inspection.pending")}</Badge>;
      case "passed":
        return <Badge className="bg-gray-500 text-white">{statusT("inspection.passed")}</Badge>;
      default:
        return <Badge variant="secondary">{statusT("inspection.not_scheduled")}</Badge>;
    }
  };
  return [
    {
      accessorKey: "title",
      header: t("apartment.infor.title"),
    },
    {
      accessorKey: "basePricePerNight",
      header: t("apartment.infor.price"),
      cell: ({ row }) => `${row.original.basePricePerNight.toLocaleString()} đ`,
    },
    {
      accessorKey: "status",
      header: t("apartment.infor.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return getStatusBadge(status);
      },
    },
    {
      accessorKey: "inspectionStatus",
      header: t("apartment.infor.inspectionStatus"),
      cell: ({ row }) => {
        const status = row.original.inspectionStatus;
        return getInspectionStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: t("apartment.infor.actions"),
      cell: ({ row }) => {
        const apartment = row.original;
        return (
          <ApartmentAction
            apartment={apartment}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddAmenity={onAddAmenity}
            onAddPackage={onAddPackage}
            onCreateRoom={onCreateRoom}
            onAddAvailability={onAddAvailability}
            onViewPackage={onViewPackage}
            onSendApprove={onSendApprove}
            onAddPhotos={onAddPhotos}
            onChangePrice={onChangePrice}
            onViewPriceChange={onViewPriceChange}
          />
        );
      },
    },
  ];
};
