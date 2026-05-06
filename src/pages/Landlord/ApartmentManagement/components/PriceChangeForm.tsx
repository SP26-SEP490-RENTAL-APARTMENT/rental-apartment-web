import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}
function PriceChangeForm({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Price</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the new price for the apartment.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default PriceChangeForm;
