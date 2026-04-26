import type { NearbyAttraction } from "@/types/nearbyAttraction";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import NearbyAction from "./NearbyAction";

export const NearbyColumns = (
  onDelete: (attractionId: string) => void,
  onEdit: (attraction: NearbyAttraction) => void,
): ColumnDef<NearbyAttraction>[] => {
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
        accessorKey: "type",
        header: "Type",
        cell: ({row}) => {
          const type = row.original.type;
          return type.charAt(0).toUpperCase() + type.slice(1);
        }
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const nearbyAttraction = row.original;
          return (
            <NearbyAction
              nearbyAttraction={nearbyAttraction}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          );
        },
      },
    ],
    [lang, onDelete, onEdit],
  );
};
