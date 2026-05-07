import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SupportTicketDetail from "@/components/ui/supportTicketDetail/SupportTicketDetail";
import type { SupportTicket } from "@/types/supportTicket";
import { Eye, SlidersHorizontal } from "lucide-react";

interface Props {
  support: SupportTicket;
  onResolve: (supportId: string) => void;
}
function SupportAction({ support, onResolve }: Props) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Ticket Detail</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-4">
            <SupportTicketDetail ticket={support} />
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        className="bg-gray-100 text-black hover:bg-gray-200"
        onClick={() => onResolve(support.ticketId)}
      >
        <SlidersHorizontal />
      </Button>
    </div>
  );
}

export default SupportAction;
