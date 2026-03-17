import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Trash2, UserRoundPen } from "lucide-react";
import type { User } from "@/types/user";
import { useTranslation } from "react-i18next";

interface Props {
  user: User;
  onDelete: (userId: string) => void;
  onEdit: (user: User) => void;
}
function UserAction({ user, onDelete, onEdit }: Props) {
  const { t: translate } = useTranslation("user");

  const handleDelete = () => {
    onDelete(user.userId);
  };

  const handleEdit = () => {
    onEdit(user);
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate("userDetails")}</DialogTitle>
            <DialogDescription>
              {translate("userDetailsDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-5">
            <div className="font-bold">{translate("userId")}</div>
            <div>{user?.userId}</div>
            <div className="font-bold">{translate("name")}</div>
            <div>{user?.fullName}</div>
            <div className="font-bold">{translate("email")}</div>
            <div>{user?.email}</div>
            <div className="font-bold">{translate("phone")}</div>
            <div>{user?.phone}</div>
            <div className="font-bold">{translate("role")}</div>
            <div>{user?.role}</div>
            <div className="font-bold">{translate("verified")}</div>
            <div>{user?.identityVerified ? "Yes" : "No"}</div>
          </div>
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="outline" onClick={handleEdit}>
        <UserRoundPen />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action will permanently remove the user from the system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="cursor-pointer"
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAction;
