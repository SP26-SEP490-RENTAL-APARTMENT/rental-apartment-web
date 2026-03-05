import type { ColumnDef } from "@tanstack/react-table";
import UserAction from "./UserAction";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {

      const user = row.original

      return <UserAction user={user} />
    },
  },
];