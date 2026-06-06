import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  note: string;
  setNote: (note: string) => void;
  loading: boolean;
}
function PenaltyForm({
  open,
  onClose,
  onSubmit,
  note,
  setNote,
  loading,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Penalty Form</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea
              placeholder="Enter note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Confirming..." : "Confirm Penalty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PenaltyForm;
