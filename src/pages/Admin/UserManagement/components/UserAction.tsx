import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, Trash2 } from "lucide-react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}
function UserAction({ user }: Props) {
  const handleDelete = () => {
    window.alert(`Delete user ${user.id}`);
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
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <p>{user.id}</p>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger>
          <Button size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UserAction;
