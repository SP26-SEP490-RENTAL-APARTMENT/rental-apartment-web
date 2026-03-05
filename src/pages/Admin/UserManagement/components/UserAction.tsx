import { Button } from "@/components/ui/button";
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

//   const handleViewDetail = () => {
//     window.alert(`View detail of user ${user.id}`);
//   };
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>{user.id}</p>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </PopoverContent>
      </Popover>
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
