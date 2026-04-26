import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/user";
import UserAction from "./UserAction";
import { Badge } from "@/components/ui/badge";

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-blue-500 text-white">Admin</Badge>;
    case "staff":
      return <Badge className="bg-green-500 text-white">Staff</Badge>;
    case "landlord":
      return <Badge className="bg-yellow-500 text-white">Landlord</Badge>;
    case "tenant":
      return <Badge className="bg-gray-500 text-white">Tenant</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

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
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => getRoleBadge(row.original.role),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserAction user={user} onDelete={onDelete} onEdit={onEdit} />;
    },
  },
];
