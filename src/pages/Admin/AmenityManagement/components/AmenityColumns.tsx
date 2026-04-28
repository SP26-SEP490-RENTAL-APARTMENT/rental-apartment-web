import type { Amenity } from "@/types/amenity";
import type { ColumnDef } from "@tanstack/react-table";
import AmenityAction from "./AmenityAction";
import { useMemo } from "react";

export const AmenityColumns = (
  onDelete: (userId: string) => void,
  onEdit: (amenity: Amenity) => void,
): ColumnDef<Amenity>[] => {
  const lang = localStorage.getItem("i18nextLng");

  return useMemo(
    () => [
      lang === "en"
        ? {
            accessorKey: "nameEn",
            header: "Name",
          }
        : {
            accessorKey: "nameVi",
            header: "Name",
          },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const amenities = row.original;
          return <AmenityAction amenity={amenities} onDelete={onDelete} onEdit={onEdit} />;
        },
      },
    ],
    [lang, onDelete, onEdit],
  );
};
