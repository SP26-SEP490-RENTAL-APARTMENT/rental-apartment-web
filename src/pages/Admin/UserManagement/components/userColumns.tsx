import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user";
import UserAction from "./UserAction";

export const userColumns = (
  onDelete: (userId: string) => void,
  onEdit: (user: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  // {
  //   accessorKey: "phone",
  //   header: "Phone",
  // },
  {
    accessorKey: "role",
    header: "Role",
  },
  // {
  //   accessorKey: "identityVerified",
  //   header: "Verified",
  //   cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserAction user={user} onDelete={onDelete} onEdit={onEdit} />;
    },
  },
];
